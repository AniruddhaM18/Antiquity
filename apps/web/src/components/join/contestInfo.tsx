"use client"
import { Contest } from "@/src/components/types"
import { FaMagnifyingGlass, FaUsers, FaRegClock } from "react-icons/fa6";



type ContestInfoProps = {
  contest: Contest
  isMember: boolean
}

export default function ContestInfo({ contest, isMember }: ContestInfoProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-neutral-900/60 rounded-sm border border-neutral-800 p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-neutral-200">
            {contest.title}
          </h1>
          {contest.description && (
            <p className="text-sm text-neutral-400 leading-relaxed">
              {contest.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-neutral-900 rounded-sm border border-neutral-800">
            <div className="flex justify-center items-center gap-2 mb-2">
              <FaMagnifyingGlass className="size-4 text-neutral-500" />
              <span className="text-md text-neutral-300">No. of Questions</span>
            </div>
            <p className="text-md text-center font-medium text-neutral-200">
              {contest.questions?.length || 0}
            </p>
          </div>

          <div className="p-4 bg-neutral-900 rounded-sm border border-neutral-800">
            <div className="flex justify-center  items-center gap-2 mb-2">
              <FaUsers className="size-4 text-neutral-500" />
              <span className="text-md text-neutral-300">Join Code</span>
            </div>
            <p className="text-md text-center font-normal text-neutral-200">
              {contest.joinCode}
            </p>
          </div>

          <div className="p-4  bg-neutral-900 rounded-sm border border-neutral-800">
            <div className="flex justify-center items-center gap-2 mb-2">
              <FaRegClock className="size-4 text-neutral-500" />
              <span className="text-md text-neutral-300">Status</span>
            </div>
            <p className="text-md text-center font-normal text-neutral-200">
              Waiting
            </p>
          </div>
        </div>

        {isMember && (
          <div className="p-4 bg-green-500/5 border border-green-500/30 rounded-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-sm text-green-500 font-normal">
                You have successfully joined this contest
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}