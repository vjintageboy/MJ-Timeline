"use client"

import { WalletConnect } from "@/components/Wallet-connect"
import { ThemeToggle } from "@/components/ThemeToggle"

export function Header() {
    return (
        <header
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 2rem",
                borderBottom: "1px solid var(--border-color)",
                backdropFilter: "blur(10px)",
                position: "sticky",
                top: 0,
                zIndex: 100,
                background: "var(--header-background)",
            }}
        >
            <h1
                style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    margin: 0,
                }}
            >
                📰 MJ Timeline
            </h1>
            <div style={{ display: "flex", alignItems: "center" }}>
                <ThemeToggle />
                <WalletConnect />
            </div>
        </header>
    )
}

