"use client"
import React, { useState } from "react"
import {
  MoreHorizontal,
  CheckSquare,
  Trash2,
  GripVertical,
  Plus,
  Clock,
  Hexagon,
  ChevronDown,
  Check,
} from "lucide-react"

type QuestionsCardProps = {
  questionNo: number
  value?: {
    text: string
    options: string[]
    correct: number
    points: number
  }
  onChange?: (data: {
    text: string
    options: string[]
    correct: number
    points: number
  }) => void
}

export function QuestionsCard({
  questionNo,
  value,
  onChange,
}: QuestionsCardProps) {
  const [text, setText] = useState(value?.text ?? "")
  const [options, setOptions] = useState<string[]>(
    value?.options ?? ["", ""]
  )
  const [correct, setCorrect] = useState<number>(value?.correct ?? 0)
  const [points, setPoints] = useState<number>(value?.points ?? 10)

  function emitChange(next?: Partial<typeof value>) {
    onChange?.({
      text,
      options,
      correct,
      points,
      ...next,
    })
  }

  function updateOption(index: number, val: string) {
    const next = [...options]
    next[index] = val
    setOptions(next)
    emitChange({ options: next })
  }

  function addOption() {
    if (options.length >= 6) return
    const next = [...options, ""]
    setOptions(next)
    emitChange({ options: next })
  }

  function removeOption(index: number) {
    if (options.length <= 2) return
    const next = options.filter((_, i) => i !== index)
    setOptions(next)
    if (correct >= next.length) setCorrect(0)
    emitChange({ options: next, correct: 0 })
  }

  return (
    <div className="w-full max-w-4xl min-h-[7.75rem] bg-neutral-900 rounded-lg border border-neutral-700 shadow-xl text-sm text-neutral-200 m-10">
      {/* Header */}
      <div className="px-4 py-2 border-b border-neutral-700 flex justify-between items-center bg-neutral-800/60 rounded-t-lg">
        <div className="flex items-center gap-2 bg-neutral-700/50 px-2 py-1 rounded cursor-pointer hover:bg-neutral-600/50 transition">
          <CheckSquare size={14} className="text-neutral-300" />
          <span className="font-medium text-xs">Multiple choice</span>
        </div>

        <button className="text-neutral-400 hover:text-neutral-200 p-1 hover:bg-neutral-700 rounded">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        <span className="font-semibold text-xs">
          Question {questionNo}
          <span className="text-red-500">*</span>
        </span>

        {/* Question Text */}
        <div className="mt-2 mb-3">
          <div className="bg-neutral-900/50 rounded p-2 border border-neutral-700 focus-within:border-indigo-500">
            <textarea
              className="w-full bg-transparent outline-none resize-none h-10 text-sm placeholder-neutral-500"
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                emitChange({ text: e.target.value })
              }}
            />
          </div>
        </div>

        {/* Options */}
        <div className="space-y-1.5 mb-3">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2 group">
              <div
                onClick={() => {
                  setCorrect(i)
                  emitChange({ correct: i })
                }}
                className={`w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer ${
                  correct === i
                    ? "bg-indigo-500 border-indigo-500"
                    : "border-neutral-500"
                }`}
              >
                {correct === i && (
                  <Check size={10} className="text-white" strokeWidth={3} />
                )}
              </div>

              <div
                className={`flex-1 h-8 px-3 flex items-center rounded border ${
                  correct === i
                    ? "border-indigo-500/50 bg-indigo-500/10"
                    : "border-neutral-700 bg-neutral-900/50"
                }`}
              >
                <input
                  className="w-full bg-transparent outline-none text-sm"
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                />
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <GripVertical size={14} className="text-neutral-500" />
                <Trash2
                  size={14}
                  className="text-red-400 cursor-pointer"
                  onClick={() => removeOption(i)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add Option */}
        <button
          onClick={addOption}
          className="flex items-center gap-1.5 px-2 py-1 text-xs border border-dashed border-neutral-600 rounded text-neutral-400 hover:bg-neutral-700/40 mb-4"
        >
          <Plus size={12} />
          Add answers
        </button>

        <hr className="border-neutral-700 mb-3" />

        {/* Points */}
        <div className="w-32">
          <span className="text-[11px] text-neutral-400">Mark as point</span>
          <div className="mt-1 h-8 flex border border-neutral-700 rounded bg-neutral-900/50">
            <input
              className="w-full text-center bg-transparent outline-none"
              type="number"
              min={1}
              value={points}
              onChange={(e) => {
                const v = Number(e.target.value)
                setPoints(v)
                emitChange({ points: v })
              }}
            />
            <div className="px-2 flex items-center text-[10px] text-neutral-400 border-l border-neutral-700">
              Points
              <Hexagon size={10} className="text-amber-500 fill-amber-500 ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
