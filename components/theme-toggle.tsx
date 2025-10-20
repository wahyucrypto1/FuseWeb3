"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-full hover:bg-accent/20 transition-all duration-300 hover:scale-110"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-400 animate-spin-slow" />
      ) : (
        <Moon className="h-5 w-5 text-slate-600 animate-pulse" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
