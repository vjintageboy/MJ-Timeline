"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Load theme from localStorage
        const savedTheme = localStorage.getItem("mjtimeline_theme") as Theme
        if (savedTheme) {
            setTheme(savedTheme)
        }
    }, [])

    useEffect(() => {
        if (mounted) {
            // Save theme to localStorage
            localStorage.setItem("mjtimeline_theme", theme)
            // Update document class for theme styling
            document.documentElement.setAttribute("data-theme", theme)
        }
    }, [theme, mounted])

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"))
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}


