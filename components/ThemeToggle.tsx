"use client"

import { useTheme } from "./ThemeProvider"

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            style={{
                padding: "0.5rem 1rem",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                background: "var(--card-background)",
                color: "var(--text-primary)",
                cursor: "pointer",
                fontSize: "1.2rem",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginRight: "1rem",
            }}
            aria-label="Toggle theme"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
            {theme === "dark" ? "☀️" : "🌙"}
        </button>
    )
}


