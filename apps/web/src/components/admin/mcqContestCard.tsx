"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ButtonWithForm() {
  const [open, setOpen] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log("Form submitted")
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      {/* Open Form Button — NO HOVER EFFECT */}
      <Button
        className="
          bg-neutral-300 text-black
          shadow-none
          hover:bg-neutral-300 hover:shadow-none
          focus-visible:ring-0 focus-visible:ring-offset-0
          active:shadow-none
        "
        onClick={() => setOpen(true)}
      >
        Create Quiz
      </Button>

      {/* Form */}
      {open && (
        <Card className="bg-neutral-900 border border-neutral-800 shadow-none rounded-md">
          <form onSubmit={handleSubmit}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-neutral-200">
                Create Contest
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Inputs — KEEP INSET DEPTH */}
              <Input
                placeholder="Title"
                className="
                  border-neutral-800
                  shadow-[inset_0_1px_1px_rgba(0,0,0,0.35)]
                  hover:shadow-[inset_0_1px_1px_rgba(0,0,0,0.35)]
                  focus-visible:ring-0
                "
              />
              <Input
                placeholder="Contest Description"
                className="
                  border-neutral-800
                  shadow-[inset_0_1px_1px_rgba(0,0,0,0.35)]
                  hover:shadow-[inset_0_1px_1px_rgba(0,0,0,0.35)]
                  focus-visible:ring-0
                "
              />
            </CardContent>

            <CardFooter className="flex gap-2 pt-2">
              {/* Submit — NO HOVER EFFECT */}
              <Button
                type="submit"
                className="
                  bg-perpdex text-white
                  shadow-none
                  hover:bg-perpdex hover:shadow-none
                  focus-visible:ring-0 focus-visible:ring-offset-0
                  active:shadow-none
                "
              >
                Let's Goo
              </Button>

              {/* Cancel — NO HOVER EFFECT */}
              <Button
                type="button"
                variant="outline"
                className="
                  border-neutral-800 text-neutral-300
                  shadow-none
                  hover:bg-transparent hover:shadow-none
                  focus-visible:ring-0 focus-visible:ring-offset-0
                  active:shadow-none
                "
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  )
}
