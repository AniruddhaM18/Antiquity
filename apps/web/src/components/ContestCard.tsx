"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ContestCardProps = {
  onClose: () => void
  onCreate: (data: {
    title: string
    description: string
    duration: number
  }) => void
}

export function ContestCard({ onClose, onCreate }: ContestCardProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState<number | "">("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return
    if (!description.trim()) return
    if (typeof duration !== "number" || duration < 1) return

    onCreate({
      title,
      description,
      duration,
    })
  }

  return (
    <Card className="relative w-full max-w-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-200"
      >
        ✕
      </button>

      <CardHeader className="text-center space-y-1.5">
        <CardTitle className="text-lg font-medium">
          Create a new contest
        </CardTitle>
        <CardDescription className="text-sm text-neutral-400">
          Enter title, description & duration
        </CardDescription>
      </CardHeader>

      <CardContent className="text-center">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title" className="">
                Title
              </Label>
              <Input
                id="title"
                type="title"
                placeholder="Quiz Contest"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-zinc-600 focus:border-zinc-500 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="">
                Description
              </Label>
              <Input
                id="description"
                type="title"
                placeholder="MCQ based contest"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-zinc-600 focus:border-zinc-500 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">
                Duration (minutes)
              </Label>

              <Input
                id="duration"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                placeholder="Upto- 60 mins"
                required
                value={duration}
                onChange={(e) =>
                  setDuration(
                    e.target.value === ""
                      ? ""
                      : Number(e.target.value)
                  )
                }
                className="border border-zinc-600
              focus:border-zinc-500 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <button
          type="submit"
          onClick={handleSubmit}
          className="neo-btn w-full rounded-md"
        >
          Create Contest
        </button>
      </CardFooter>
    </Card>
  )
}
