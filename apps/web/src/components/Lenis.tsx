import ScrollStack, { ScrollStackItem } from "./lenisComponent";

export default function LenisComponent() {
    return (
        <div className="w-full h-screen relative">
            <ScrollStack
                useWindowScroll={false}
                itemDistance={80}
                itemStackDistance={40}
                stackPosition="10%"
                scaleEndPosition="15%"
                baseScale={0.9}
                itemScale={0.05}
            >
                <ScrollStackItem itemClassName="bg-gradient-to-br from-neutral-700/60 to-neutral-800/50 border-2 border-neutral-500/60 backdrop-blur-md">
                    <h2 className="text-4xl font-bold text-white mb-6">Real-time Engagement</h2>
                    <p className="text-neutral-100 text-xl leading-relaxed">
                        Connect with your audience instantly through live contests and interactive challenges
                    </p>
                </ScrollStackItem>

                <ScrollStackItem itemClassName="bg-gradient-to-br from-neutral-600/60 to-neutral-700/50 border-2 border-neutral-400/60 backdrop-blur-md">
                    <h2 className="text-4xl font-bold text-white mb-6">Analytics Dashboard</h2>
                    <p className="text-neutral-100 text-xl leading-relaxed">
                        Track participation, engagement metrics, and winner statistics in real-time
                    </p>
                </ScrollStackItem>

                <ScrollStackItem itemClassName="bg-gradient-to-br from-orange-600/60 to-orange-700/50 border-2 border-orange-400/60 backdrop-blur-md">
                    <h2 className="text-4xl font-bold text-white mb-6">More engagement,
                        every day.
                    </h2>
                    <p className="text-neutral-100 text-xl leading-relaxed">
                        Easily add participation into more areas of work and learning, helping everyone engage more and understand better.
                    </p>
                </ScrollStackItem>

                <ScrollStackItem itemClassName="bg-gradient-to-br from-orange-600/90 to-orange-700/50 border-2 border-orange-500/60 backdrop-blur-md">
                    <h2 className="text-4xl font-bold text-white mb-6">Good questions,
                        great insights.
                    </h2>
                    <p className="text-neutral-100 text-xl leading-relaxed">
                        Start with a question. Get answers in real time. Use what you learn to shape what comes next.
                    </p>
                </ScrollStackItem>
            </ScrollStack>
        </div>
    );
}