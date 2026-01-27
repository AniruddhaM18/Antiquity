import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import React from "react"

interface TooltipComponentProps {
  children: React.ReactNode
  content: string
}

export default function TooltipComponent({
  children,
  content,
}: TooltipComponentProps) {
  return (
    <TooltipProvider>
    <Tooltip> 
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        {content}
      </TooltipContent>
    </Tooltip>
    </TooltipProvider>
  )
}
