import type { Component } from "svelte";

export interface PostMetadata extends Record<string, unknown> {
    title: string;
    date: string;
    description: string;
    tags?: Array<string>;
    draft?: boolean;
}

export interface Post {
    metadata: PostMetadata;
    default: () => Component;
}


