"use client"

import { useTimeline, Post } from "@/hooks/useTimeline"
import { Container, Heading, Text, Card, Flex, Badge, Button, TextArea } from "@radix-ui/themes"
import ClipLoader from "react-spinners/ClipLoader"
import { useState } from "react"

// Helper to format timestamp
const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
}

// Helper to truncate address
const truncateAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

interface PostCardProps {
    post: Post
    currentUserAddress?: string
    onLike: (postId: number) => void
    onUnlike: (postId: number) => void
    onDelete: (postId: number) => void
    onComment: (postId: number, content: string) => void
    hasLiked: boolean
}

const PostCard = ({ post, currentUserAddress, onLike, onUnlike, onDelete, onComment, hasLiked }: PostCardProps) => {
    const [showCommentBox, setShowCommentBox] = useState(false)
    const [commentContent, setCommentContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isAuthor = currentUserAddress && post.author.toLowerCase() === currentUserAddress.toLowerCase()

    const handleCommentSubmit = async () => {
        if (!commentContent.trim()) return
        setIsSubmitting(true)
        await onComment(post.id, commentContent.trim())
        setCommentContent("")
        setShowCommentBox(false)
        setIsSubmitting(false)
    }

    if (post.is_deleted) {
        return (
            <Card
                style={{
                    background: "var(--deleted-background)",
                    border: "1px solid var(--deleted-border)",
                    borderRadius: "16px",
                    padding: "1rem",
                    marginBottom: "1rem",
                    opacity: 0.6,
                }}
            >
                <Text style={{ color: "var(--deleted-text)", fontStyle: "italic" }}>
                    🗑️ This post has been deleted
                </Text>
            </Card>
        )
    }

    return (
        <Card
            style={{
                background: "var(--card-background)",
                border: "1px solid var(--card-border)",
                borderRadius: "16px",
                padding: "1.25rem",
                marginBottom: "1rem",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
            }}
        >
            <Flex justify="between" align="center" style={{ marginBottom: "0.75rem" }}>
                <Badge
                    size="2"
                    style={{
                        background: isAuthor 
                            ? "var(--author-badge-gradient)"
                            : "var(--badge-gradient)",
                        color: "white",
                        fontFamily: "monospace",
                    }}
                >
                    {isAuthor ? "👑 " : ""}{truncateAddress(post.author)}
                </Badge>
                <Flex gap="2" align="center">
                    <Text size="1" style={{ color: "var(--text-secondary)" }}>
                        {formatTime(post.timestamp)}
                    </Text>
                    {isAuthor && (
                        <Button
                            size="1"
                            variant="ghost"
                            onClick={() => onDelete(post.id)}
                            style={{
                                cursor: "pointer",
                                color: "rgba(239, 68, 68, 0.8)",
                                padding: "0.25rem 0.5rem",
                            }}
                        >
                            🗑️
                        </Button>
                    )}
                </Flex>
            </Flex>
            <Text
                size="3"
                style={{
                    color: "var(--text-primary)",
                    lineHeight: "1.6",
                    wordBreak: "break-word",
                    marginBottom: "0.75rem",
                }}
            >
                {post.content}
            </Text>
            
            {/* Action buttons */}
            <Flex gap="3" style={{ marginTop: "0.75rem", borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem" }}>
                <Button
                    size="2"
                    variant="ghost"
                    onClick={() => hasLiked ? onUnlike(post.id) : onLike(post.id)}
                    style={{
                        cursor: "pointer",
                        color: hasLiked ? "#ef4444" : "var(--text-secondary)",
                        transition: "all 0.2s",
                    }}
                >
                    {hasLiked ? "❤️" : "🤍"} {post.likes}
                </Button>
                <Button
                    size="2"
                    variant="ghost"
                    onClick={() => setShowCommentBox(!showCommentBox)}
                    style={{
                        cursor: "pointer",
                        color: "var(--text-secondary)",
                    }}
                >
                    💬 {post.comment_count}
                </Button>
            </Flex>

            {/* Comment box */}
            {showCommentBox && (
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
                    <TextArea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Add a comment..."
                        style={{
                            marginBottom: "0.5rem",
                            background: "var(--input-background)",
                            border: "1px solid var(--border-color)",
                            color: "var(--text-primary)",
                            minHeight: "60px",
                        }}
                    />
                    <Flex gap="2">
                        <Button
                            size="2"
                            onClick={handleCommentSubmit}
                            disabled={isSubmitting || !commentContent.trim()}
                            style={{
                                background: "var(--button-gradient)",
                                color: "white",
                                cursor: isSubmitting ? "not-allowed" : "pointer",
                            }}
                        >
                            {isSubmitting ? "Posting..." : "Post Comment"}
                        </Button>
                        <Button
                            size="2"
                            variant="outline"
                            onClick={() => {
                                setShowCommentBox(false)
                                setCommentContent("")
                            }}
                        >
                            Cancel
                        </Button>
                    </Flex>
                </div>
            )}
        </Card>
    )
}

export function Timeline() {
    const { posts, isFetchingPosts, timelineId, state, actions, currentAccount, userLikes } = useTimeline()
    const [searchQuery, setSearchQuery] = useState("")

    if (!timelineId) {
        return null
    }

    if (state.error) {
        return (
            <Container style={{ padding: "2rem", textAlign: "center" }}>
                <div
                    style={{
                        padding: "1.5rem",
                        border: "1px solid var(--error-border)",
                        borderRadius: "14px",
                        background: "var(--error-background)",
                    }}
                >
                    <Heading size="4" style={{ color: "var(--error-text)" }}>
                        ⚠️ Unable to load posts
                    </Heading>
                    <Text style={{ color: "var(--text-secondary)", display: "block", marginTop: "0.5rem" }}>
                        {state.error.message}
                    </Text>
                    <button
                        onClick={actions.fetchPosts}
                        style={{
                            marginTop: "1rem",
                            padding: "0.65rem 1.4rem",
                            borderRadius: "10px",
                            border: "1px solid var(--border-color)",
                            background: "var(--button-gradient)",
                            color: "white",
                            cursor: "pointer",
                        }}
                    >
                        Retry
                    </button>
                </div>
            </Container>
        )
    }

    // Filter posts based on search query
    const filteredPosts = posts.filter(post => 
        !post.is_deleted && (
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.toLowerCase().includes(searchQuery.toLowerCase())
        )
    )

    if (isFetchingPosts && posts.length === 0) {
        return (
            <Container style={{ padding: "2rem", textAlign: "center" }}>
                <ClipLoader color="#8b5cf6" size={40} />
                <Text style={{ display: "block", marginTop: "1rem", color: "var(--text-secondary)" }}>
                    Loading posts...
                </Text>
            </Container>
        )
    }

    if (posts.length === 0) {
        return (
            <Container style={{ padding: "2rem", textAlign: "center" }}>
                <div
                    style={{
                        padding: "3rem",
                        background: "var(--card-background)",
                        borderRadius: "20px",
                        border: "1px dashed var(--border-color)",
                    }}
                >
                    <Text size="4" style={{ color: "var(--text-secondary)" }}>
                        📝 No posts yet. Be the first to share something!
                    </Text>
                </div>
            </Container>
        )
    }

    const activePosts = posts.filter(p => !p.is_deleted)

    return (
        <Container style={{ padding: "1rem 0" }}>
            <Flex justify="between" align="center" style={{ marginBottom: "1.5rem" }}>
                <Heading
                    size="5"
                    style={{
                        background: "linear-gradient(90deg, #f8f8ff, #a5b4fc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    📰 Timeline ({activePosts.length} {activePosts.length === 1 ? "post" : "posts"})
                </Heading>
            </Flex>

            {/* Search box */}
            {activePosts.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                    <input
                        type="text"
                        placeholder="🔍 Search posts or authors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "0.75rem 1rem",
                            background: "var(--input-background)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "12px",
                            color: "var(--text-primary)",
                            fontSize: "1rem",
                        }}
                    />
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column" }}>
                {filteredPosts.length === 0 ? (
                    <Text style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2rem" }}>
                        No posts found matching "{searchQuery}"
                    </Text>
                ) : (
                    filteredPosts.map((post) => (
                        <PostCard 
                            key={post.id} 
                            post={post}
                            currentUserAddress={currentAccount}
                            onLike={actions.likePost}
                            onUnlike={actions.unlikePost}
                            onDelete={actions.deletePost}
                            onComment={actions.addComment}
                            hasLiked={userLikes.has(post.id)}
                        />
                    ))
                )}
            </div>

            {isFetchingPosts && (
                <Flex justify="center" style={{ padding: "1rem" }}>
                    <ClipLoader color="#8b5cf6" size={24} />
                </Flex>
            )}
        </Container>
    )
}

export default Timeline


