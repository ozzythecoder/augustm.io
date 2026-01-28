import type { Component } from "svelte";

interface PostMetadata extends Record<string, unknown> {
    title: string;
    date: string;
    description: string;
    tags?: string;
}

export interface Post {
    metadata: PostMetadata;
    default: () => Component;
}