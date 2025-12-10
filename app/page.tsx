"use client"

import Timeline from "@/components/Timeline"
import CreatePost from "@/components/CreatePost"
import { Header } from "@/components/Header"

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--page-background)",
      }}
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "2rem 1rem",
        }}
      >
        <CreatePost />
        <Timeline />
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "2rem",
          color: "var(--text-muted)",
          fontSize: "0.85rem",
        }}
      >
        Powered by IOTA Move • Micro-Journalism Timeline
      </footer>
    </div>
  )
}


