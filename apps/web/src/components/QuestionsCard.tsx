"use client"
import React, { useState, useEffect } from "react"
import {
  CheckSquare,
  Trash2,
  GripVertical,
  Plus,
  Hexagon,
  Check,
  X,
} from "lucide-react"
import { IoMdTrash } from "react-icons/io"
import { QuestionValue, useQuestionStore } from "../store/useQuestionStore"
import { Input } from "@/components/ui/input"
import TooltipComponent from "./ui/TooltipComponent"
import { Button } from "@/components/ui/button"
import EditorPallate from "./new/editorPallate"

type QuestionsCardProps = {
  question: QuestionValue
  index: number
}

export default function QuestionsCard({ question: questionProp, index }: QuestionsCardProps) {

  const { updateQuestion, deleteQuestion } = useQuestionStore();

  const { id, question, options, correct, points } = questionProp

  if (!questionProp) {
    return null
  }

  function update(data: Partial<QuestionValue>) {
    updateQuestion(id, data)
  }

  function updateOption(i: number, value: string) {
    const next = [...options]
    next[i] = value
    update({ options: next })
  }

  function addOption() {
    if (options.length >= 6) return
    update({ options: [...options, ""] })
  }

  function removeOption(i: number) {
    if (options.length <= 2) return

    const next = options.filter((_, idx) => idx !== i)
    const nextCorrect = correct >= next.length ? 0 : correct

    update({ options: next, correct: nextCorrect })
  }

  return (
    <div className="w-full h-full text-sm text-neutral-200 ">
    {/* Header */}
    <div className="px-4 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
      <TooltipComponent content="Choose the kind of question you want">
        <div className="flex items-center gap-2 bg-neutral-700/50 px-4 py-2.5 rounded-sm">
          <CheckSquare size={14} className="text-orange-300" />
          <span className="font-medium text-xs">Multiple choice</span>
        </div>
      </TooltipComponent>

      <button
        onClick={() => deleteQuestion(id)}
        className="text-neutral-400 hover:text-red-500 p-1 rounded hover:bg-neutral-700"
      >
        <IoMdTrash size={18} />
      </button>
    </div>

    {/* Body */}

    
   <main className="h-full w-full bg-neutral-950 flex overflow-hidden">
    <section className="w-full">
      <div className="p-4">
        <span className="font-semibold text-xs">
          Question {index + 1}
          <span className="text-red-500">*</span>
        </span>

        {/* Question Text */}
        <div className="mt-2 mb-3">
          <div className="bg-neutral-900/50 mr-15 rounded p-2 border border-neutral-700 focus-within:border-orange-500/60">
            <textarea
              className="w-full bg-transparent outline-none resize-none h-10 text-sm placeholder-neutral-500 h-20"
              value={question ?? ""}
              onChange={(e) => update({ question: e.target.value })}
            />
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3.5 mb-3">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2 group">
              <div
                onClick={() => update({ correct: i })}
                className={`w-6 h-6 rounded-sm border flex items-center justify-center cursor-pointer ${correct === i
                  ? "bg-orange-500 border-orange-500"
                  : "border-neutral-500"
                  }`}
              >
                {correct === i && (
                  <Check size={14} className="text-white" strokeWidth={3} />
                )}
              </div>

              <div
                className={`flex-1 h-12 px-3 flex items-center rounded border ${correct === i
                  ? "border-orange-500/50 bg-orange-500/10"
                  : "border-neutral-700 bg-neutral-900/50"
                  }`}
              >
                <Input
                  className="w-full outline-none text-sm border-none bg-transparent! focus-visible:ring-0"
                  value={opt ?? ""}
                  onChange={(e) => updateOption(i, e.target.value)}
                />
              </div>

              <div className="flex gap-2 opacity-80 transition items-center">
                <GripVertical size={26} className="text-neutral-400 bg-neutral-800/80 rounded-sm p-1" />
                <Trash2
                  size={18}
                  className="text-red-400 hover:text-red-500 cursor-pointer"
                  onClick={() => removeOption(i)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add Option */}
        <Button
          onClick={addOption}
          className="flex items-center gap-1.5 px-2 py-1.5 text-xs border border-dashed border-neutral-600 rounded text-neutral-300 bg-neutral-800 hover:bg-neutral-700/60 mb-4"
        >
          <Plus size={12} />
          Add answers
        </Button>

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
              onChange={(e) => update({ points: Number(e.target.value) })}
            />
            <div className="px-2 flex items-center text-[10px] text-neutral-400 border-l border-neutral-700">
              Points
              <Hexagon
                size={10}
                className="text-amber-500 fill-amber-500 ml-1"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
     <aside className="w-48 border-l border-neutral-800">
        <EditorPallate />
      </aside>
    </main> 

    

    
    </div>
  )
}
