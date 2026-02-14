"use client"

import { useState } from "react"

import {
    Select, SelectContent,
    SelectGroup, SelectItem,
    SelectLabel, SelectTrigger,
    SelectValue
} from "@/components/ui/select"


export default function EditorPallate() {
    const [selected, setSelected] = useState<string>("")


    return (
        <div className="h-full w-48 bg-neutral-950 p-2">
            <h1 className="text-sm text-neutral-400">Controls</h1>
            <section >
                <div className="flex justify-center pt-3">
                    <Select value={selected} onValueChange={setSelected}>
                        <SelectTrigger className="w-38 rounded-sm px-2">
                            <SelectValue placeholder="Points Multiplier" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="liner">Liner</SelectItem>
                                <SelectItem value="multiplier">Multiplier</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </section>
            <section className="mt-auto p-1">
                {selected === "liner" && (
                    <div className="rounded-sm bg-neutral-800 p-3 text-sm text-neutral-200">
                        <h2 className="mb-2 font-medium">Liner Settings</h2>
                        <p>Configure liner related options here.</p>
                    </div>
                )}

                {selected === "multiplier" && (
                    <div className="rounded-sm bg-neutral-800 p-3 text-sm text-neutral-200">
                        <h2 className="mb-2 font-medium">Multiplier Settings</h2>
                        <p>Adjust multiplier logic here.</p>
                    </div>
                )}

                {selected === "custom" && (
                    <div className="rounded-sm bg-neutral-800 p-3 text-sm text-neutral-200">
                        <h2 className="mb-2 font-medium">Custom Settings</h2>
                        <p>Build your custom configuration here.</p>
                    </div>
                )}
            </section>
        </div>
    )
}