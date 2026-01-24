import { Question } from "../../../../packages/database/generated/client/index.js";
import redis from "./redisClient.js";


export interface LiveContestState {
    liveContestId: string,
    contestId: string,
    currentIndex: number,
    startedAt: string, //ISO string for Redis
    endedAt?: string,  //ISO string for Redis
    questions: Question[],
    createdBy: string,
    memberIds: string[],
    title: string
}

export interface Response {
    userId: string,
    questionIndex: number,
    selected: number,
    isCorrect: boolean,
    answeredAt: string //iso string
}

export interface LeaderboardEntry {
    userId: string,
    score: number,
    correctAnswers: number
}

//redis key pattern
const KEYS = {
    contest: (contestId: string) => `contest:${contestId}`,
    liveToContest: (liveContestId: string) => `live:${liveContestId}:contest`,
    response: (liveContestId: string, userId: string, questionIndex: number) =>
        `response:${liveContestId}:${userId}:${questionIndex}`,
    userResponses: (liveContestId: string, userId: string) =>
        `response:${liveContestId}:${userId}`,
    allResponses: (liveContestId: string) => `response:${liveContestId}:*`
};

//time to live - 1hr (contest shouldn't last too long)

const CONTEST_TTL = 1 * 60 * 60;

//liveContest
export class LiveContestStore {
    //start a live contest -stored in redis

    async start(contestId: string, liveContestId: string, state: LiveContestState): Promise<void> {
        //storing contest state at json
        await redis.setex(
            KEYS.contest(contestId),
            CONTEST_TTL,
            JSON.stringify(state)
        );

        //map liveContestId to contestId for reverse lookup
        await redis.setex(
            KEYS.liveToContest(liveContestId),
            CONTEST_TTL,
            contestId
        );

    }
    //get contest state by contestId
    async getByContestId(contestId: string): Promise<LiveContestState | null> {
        const data = await redis.get(KEYS.contest(contestId));
        if (!data) return null;
        return JSON.parse(data) as LiveContestState;
    }

    //get contest state by liveContestId
    async getByLiveId(liveContestId: string): Promise<LiveContestState | null> {
        const contestId = await redis.get(KEYS.liveToContest(liveContestId));
        if (!contestId) return null;
        return this.getByContestId(contestId)
    }

    //checing if contest is live
    async isLive(contestId: string): Promise<boolean> {
        const state = await this.getByContestId(contestId);
        return state !== null && !state?.endedAt
    }

    //move to next question - atomic operation
    async nextQuestion(contestId: string): Promise<number | null> {
        const state = await this.getByContestId(contestId);
        if (!state || !state.endedAt) return null;

        if (state.currentIndex + 1 >= state.questions.length) {
            return null //no more questions
        }

        //updat currentIndex atomically 
        state.currentIndex++;
        await redis.setex(
            KEYS.contest(contestId),
            CONTEST_TTL,
            JSON.stringify(state)
        );
        return state.currentIndex;
    }

    //end contest
    async end(contestId: string): Promise<String | null> {
        const state = await this.getByContestId(contestId);
        if (!state || state.endedAt) return null;

        state.endedAt = new Date().toISOString();
        await redis.setex(
            KEYS.contest(contestId),
            CONTEST_TTL,
            JSON.stringify(state)
        );
        return state.endedAt;
    }

    //submit answer - now stores in redis
    async submitAnswer(liveContestId: string, userId: string, questionIndex: number, selected: number,
        isCorrect: boolean): Promise<void> {
        const response: Response = {
            userId,
            questionIndex,
            selected,
            isCorrect,
            answeredAt: new Date().toISOString()
        };

        // store individual responses
        const responseKey = KEYS.response(liveContestId, userId, questionIndex);
        await redis.setex(responseKey, CONTEST_TTL, JSON.stringify(response));

        //Also add user's response set (for quick/faster retrival )
        const userResponsesKey = KEYS.userResponses(liveContestId, userId);
        await redis.sadd(userResponsesKey, questionIndex.toString());
        await redis.expire(userResponsesKey, CONTEST_TTL)
    }

    ////get users response in ///M34Oi FORMAT ///:::///
    async getUserResponse(liveContestId: string, userId: string, questionIndex: number): Promise<Response | null> {
        const responseKey = KEYS.response(liveContestId, userId, questionIndex);
        const data = await redis.get(responseKey);
        if (!data) return null;
        return JSON.parse(data) as Response;
    }

    //get all responses for a user 
    async getUserResponses(liveContestId: string, userId: string): Promise<Response[]> {
        const userResponsesKey = KEYS.userResponses(liveContestId, userId);
        const questionIndexs = await redis.smembers(userResponsesKey);

        if (questionIndexs.length === 0) return [];

        // fetch all responses in paraller
        const responses = await Promise.all(
            questionIndexs.map(async (qIndex) => {
                const responseKey = KEYS.response(liveContestId, userId, parseInt(qIndex));
                const data = await redis.get(responseKey);
                return data ? JSON.parse(data) as Response : null;
            })
        )
        //filter nulls and sort by questionIndex
        return responses
            .filter((r): r is Response => r !== null)
            .sort((a, b) => a.questionIndex - b.questionIndex);
    }

    //calculate leaderboard from redis
    async getLeaderboard(liveContestId: string): Promise<LeaderboardEntry[]> {
        const state = await this.getByLiveId(liveContestId);
        if (!state) return [];

        //get all response keys for the contes
        const pattern = KEYS.allResponses(liveContestId);
        const keys = await this.scanKeys(pattern);

        if (keys.length === 0) return [];
        //fetch all responses
        const responseData = await redis.mget(...keys);
        const responses = responseData
            .filter((data): data is string => data !== null)
            .map(data => JSON.parse(data) as Response);

        //calculate score
        const scores = new Map<string, { score: number; correct: number }>();

        for (const response of responses) {
            const question = state.questions[response.questionIndex];
            if (!question) continue;

            const current = scores.get(response.userId) || { score: 0, correct: 0 };

            if (response.isCorrect) {
                current.score += question.points;
                current.correct++;
            }

            scores.set(response.userId, current);
        }

        //convert into array and sort
        return Array.from(scores.entries())
            .map(([userId, data]) => ({
                userId,
                score: data.score,
                correctAnswers: data.correct
            }))
            .sort((a, b) => b.score - a.score);
    }

    //get response count for a contest
    async getResponseCount(liveContestId:string):Promise<number> {
        const pattern = KEYS.allResponses(liveContestId);
        const keys = await this.scanKeys(pattern);
        return keys.length;
    }

    //helper
    private async scanKeys(pattern: string) {
        const keys: string[] = [];
        let cursor = '0';

        do {
            const [nextCursor, foundKeys] = await redis.scan(
                cursor,
                'MATCH',
                pattern,
                'COUNT',
                100
            );
            cursor = nextCursor;
            keys.push(...foundKeys);
        } while (cursor !== '0');
        return keys;
    }

   // Cleanup ended contests (optional - Redis TTL handles this)
    async cleanup(maxAgeMinutes: number = 60): Promise<void> {
        // Redis TTL automatically expires keys
        // This is just for manual cleanup if needed
        const pattern = 'contest:*';
        const keys = await this.scanKeys(pattern);

        const now = Date.now();
        const maxAge = maxAgeMinutes * 60 * 1000;

        for (const key of keys) {
            const data = await redis.get(key);
            if (!data) continue;

            const state = JSON.parse(data) as LiveContestState;
            if (state.endedAt) {
                const endedAt = new Date(state.endedAt).getTime();
                if (now - endedAt > maxAge) {
                    // TTL will handle cleanup, but we can delete manually
                    await redis.del(key);
                }
            }
        }
    }

}

//singelton instance
export const liveContestStore = new LiveContestStore();
