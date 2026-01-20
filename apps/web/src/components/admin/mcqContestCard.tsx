"use client"
import axios from "axios"


import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { api } from "@/lib/api"

export function ButtonWithForm() {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setLoading(true)

  const token = localStorage.getItem("token")
  console.log("token is", token);

  if (!token) {
    alert("You are not logged in")
    setLoading(false)
    return
  }

  try {
    console.log("data")
    const { data } = await axios.post(
      "http://localhost:3001/api/contests/create",
      { title, description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

    router.push(`/create/${data.contest.id}`)
  } catch (err) {
    console.error(err)
    alert("Unauthorized")
  } finally {
    setLoading(false)
  }
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
              {/* Title */}
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="
                  border-neutral-800
                  shadow-[inset_0_1px_1px_rgba(0,0,0,0.35)]
                  hover:shadow-[inset_0_1px_1px_rgba(0,0,0,0.35)]
                  focus-visible:ring-0
                "
                required
              />

              {/* Description */}
              <Input
                placeholder="Contest Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="
                  border-neutral-800
                  shadow-[inset_0_1px_1px_rgba(0,0,0,0.35)]
                  hover:shadow-[inset_0_1px_1px_rgba(0,0,0,0.35)]
                  focus-visible:ring-0
                "
                required
              />
            </CardContent>

            <CardFooter className="flex gap-2 pt-2">
              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="
                  bg-perpdex text-white
                  shadow-none
                  hover:bg-perpdex hover:shadow-none
                  focus-visible:ring-0 focus-visible:ring-offset-0
                  active:shadow-none
                "
              >
                {loading ? "Creating..." : "Let's Goo"}
              </Button>

              {/* Cancel */}
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
