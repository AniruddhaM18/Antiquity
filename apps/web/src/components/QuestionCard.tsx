"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QuestionInput } from "./types"


type Props = {
  index: number
  question: QuestionInput
  onChange: (q: QuestionInput) => void
  onRemove: () => void
}

export function AddQuestionCard({
  index,
  question,
  onChange,
  onRemove,
}: Props) {
  const updateOption = (i: number, value: string) => {
    const options = [...question.options]
    options[i] = value
    onChange({ ...question, options })
  }

  const addOption = () => {
    if (question.options.length >= 6) return
    onChange({
      ...question,
      options: [...question.options, ""],
    })
  }

  const removeOption = (i: number) => {
    if (question.options.length <= 2) return
    const options = question.options.filter((_, idx) => idx !== i)
    onChange({
      ...question,
      options,
      correct: 0,
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Question {index + 1}</CardTitle>
        <Button className="bg-red-500/70" variant="destructive" size="sm" onClick={onRemove}>
          Remove
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label>Question</Label>
          <Input
            value={question.text}
            onChange={(e) =>
              onChange({ ...question, text: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Options</Label>

          {question.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
              />

              <input
                type="radio"
                checked={question.correct === i}
                onChange={() =>
                  onChange({ ...question, correct: i })
                }
              />

              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeOption(i)}
              >
                ✕
              </Button>
            </div>
          ))}

          <Button
            size="sm"
            className="bg-zinc-300/80"
            variant="secondary"
            onClick={addOption}
          >
            Add Option
          </Button>
        </div>

        <div className="space-y-1">
          <Label>Points</Label>
          <Input
            type="number"
            min={1}
            value={question.points}
            onChange={(e) =>
              onChange({
                ...question,
                points: Number(e.target.value),
              })
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
