import { cn } from "@/lib/utils"

interface LoadingDotsProps {
  className?: string
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn("flex gap-1", className)}>
      <span
        className="h-2 w-2 rounded-full bg-current animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="h-2 w-2 rounded-full bg-current animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="h-2 w-2 rounded-full bg-current animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  )
}
