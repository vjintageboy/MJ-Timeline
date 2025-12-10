// Copyright (c) Mysten Labs, Inc.
// Modifications Copyright (c) 2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

/// MJ Timeline - A decentralized micro-journaling platform
/// Features: Posts, Likes, Comments, Delete
module mjtimeline::timeline {
    use std::string::{String};
    use iota::table::{Self, Table};
    use iota::vec_set::{Self, VecSet};
    use iota::event;
    use iota::object::{Self, UID};
    use iota::transfer;
    use iota::tx_context::{Self, TxContext};

    /// Error codes
    const ENotAuthor: u64 = 0;
    const EPostNotFound: u64 = 1;
    const EAlreadyLiked: u64 = 2;
    const ENotLiked: u64 = 3;

    /// The timeline object. managed as a shared object.
    public struct Timeline has key {
        id: UID,
        posts: Table<u64, Post>,
        post_count: u64
    }

    /// A struct representing a single post on the timeline
    public struct Post has store, drop, copy {
        author: address,
        content: String,
        timestamp: u64,
        likes: u64,
        comment_count: u64,
        is_deleted: bool,
    }

    /// A struct representing a comment on a post
    public struct Comment has store, drop, copy {
        author: address,
        content: String,
        timestamp: u64,
    }

    /// Separate table to track likes per post
    public struct PostLikes has key {
        id: UID,
        // post_id -> set of addresses who liked
        likes: Table<u64, VecSet<address>>,
    }

    /// Separate table to track comments per post
    public struct PostComments has key {
        id: UID,
        // post_id -> vector of comments
        comments: Table<u64, vector<Comment>>,
    }

    /// Event emitted when a new post is created
    public struct PostCreated has copy, drop {
        id: u64,
        author: address,
        content: String,
        timestamp: u64
    }

    /// Event emitted when a post is liked
    public struct PostLiked has copy, drop {
        post_id: u64,
        liker: address,
    }

    /// Event emitted when a post is unliked
    public struct PostUnliked has copy, drop {
        post_id: u64,
        unliker: address,
    }

    /// Event emitted when a comment is added
    public struct CommentAdded has copy, drop {
        post_id: u64,
        author: address,
        content: String,
        timestamp: u64,
    }

    /// Event emitted when a post is deleted
    public struct PostDeleted has copy, drop {
        post_id: u64,
        author: address,
    }

    /// Create and share the Timeline object along with its auxiliary objects
    public fun create_timeline(ctx: &mut TxContext) {
        transfer::share_object(Timeline {
            id: object::new(ctx),
            posts: table::new(ctx),
            post_count: 0
        });

        transfer::share_object(PostLikes {
            id: object::new(ctx),
            likes: table::new(ctx),
        });

        transfer::share_object(PostComments {
            id: object::new(ctx),
            comments: table::new(ctx),
        });
    }

    /// Create a new post and add it to the timeline
    public fun create_post(
        timeline: &mut Timeline,
        content: String,
        clock: &iota::clock::Clock,
        ctx: &mut TxContext
    ) {
        let post_id = timeline.post_count;
        let author = tx_context::sender(ctx);
        let timestamp = iota::clock::timestamp_ms(clock);
        
        let new_post = Post {
            author,
            content,
            timestamp,
            likes: 0,
            comment_count: 0,
            is_deleted: false,
        };

        table::add(&mut timeline.posts, post_id, new_post);
        timeline.post_count = timeline.post_count + 1;

        event::emit(PostCreated {
            id: post_id,
            author,
            content,
            timestamp
        });
    }

    /// Like a post
    public fun like_post(
        timeline: &mut Timeline,
        post_likes: &mut PostLikes,
        post_id: u64,
        ctx: &mut TxContext
    ) {
        let liker = tx_context::sender(ctx);
        let post = table::borrow_mut(&mut timeline.posts, post_id);
        
        // Initialize likes set for this post if it doesn't exist
        if (!table::contains(&post_likes.likes, post_id)) {
            table::add(&mut post_likes.likes, post_id, vec_set::empty());
        };

        let likes_set = table::borrow_mut(&mut post_likes.likes, post_id);
        
        // Check if already liked
        assert!(!vec_set::contains(likes_set, &liker), EAlreadyLiked);
        
        vec_set::insert(likes_set, liker);
        post.likes = post.likes + 1;

        event::emit(PostLiked {
            post_id,
            liker,
        });
    }

    /// Unlike a post
    public fun unlike_post(
        timeline: &mut Timeline,
        post_likes: &mut PostLikes,
        post_id: u64,
        ctx: &mut TxContext
    ) {
        let unliker = tx_context::sender(ctx);
        let post = table::borrow_mut(&mut timeline.posts, post_id);
        
        assert!(table::contains(&post_likes.likes, post_id), ENotLiked);
        let likes_set = table::borrow_mut(&mut post_likes.likes, post_id);
        
        assert!(vec_set::contains(likes_set, &unliker), ENotLiked);
        
        vec_set::remove(likes_set, &unliker);
        post.likes = post.likes - 1;

        event::emit(PostUnliked {
            post_id,
            unliker,
        });
    }

    /// Add a comment to a post
    public fun add_comment(
        timeline: &mut Timeline,
        post_comments: &mut PostComments,
        post_id: u64,
        content: String,
        clock: &iota::clock::Clock,
        ctx: &mut TxContext
    ) {
        let author = tx_context::sender(ctx);
        let timestamp = iota::clock::timestamp_ms(clock);
        let post = table::borrow_mut(&mut timeline.posts, post_id);
        
        let comment = Comment {
            author,
            content,
            timestamp,
        };

        // Initialize comments vector for this post if it doesn't exist
        if (!table::contains(&post_comments.comments, post_id)) {
            table::add(&mut post_comments.comments, post_id, vector::empty());
        };

        let comments_vec = table::borrow_mut(&mut post_comments.comments, post_id);
        vector::push_back(comments_vec, comment);
        post.comment_count = post.comment_count + 1;

        event::emit(CommentAdded {
            post_id,
            author,
            content,
            timestamp,
        });
    }

    /// Delete a post (only author can delete)
    public fun delete_post(
        timeline: &mut Timeline,
        post_id: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let post = table::borrow_mut(&mut timeline.posts, post_id);
        
        assert!(post.author == sender, ENotAuthor);
        assert!(!post.is_deleted, EPostNotFound);
        
        post.is_deleted = true;

        event::emit(PostDeleted {
            post_id,
            author: sender,
        });
    }

    /// Check if a user has liked a post
    public fun has_liked(
        post_likes: &PostLikes,
        post_id: u64,
        user: address
    ): bool {
        if (!table::contains(&post_likes.likes, post_id)) {
            return false
        };
        let likes_set = table::borrow(&post_likes.likes, post_id);
        vec_set::contains(likes_set, &user)
    }

    /// Get comments for a post
    public fun get_comments(
        post_comments: &PostComments,
        post_id: u64
    ): vector<Comment> {
        if (!table::contains(&post_comments.comments, post_id)) {
            return vector::empty()
        };
        *table::borrow(&post_comments.comments, post_id)
    }

    /// Getter to read a post
    public fun get_post(timeline: &Timeline, id: u64): &Post {
        table::borrow(&timeline.posts, id)
    }
    
    /// Get the total number of posts
    public fun get_post_count(timeline: &Timeline): u64 {
        timeline.post_count
    }
}

