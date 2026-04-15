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

export interface ProjectMetadata extends Record<string, unknown> {
    title: string;
    client?: string;
    start_date: string;
    end_date?: string;
    categories: Array<string>;
    priority?: string; // must be parsed to number
    tags?: Array<string>;
    github?: string;
    website?: string;
    screenshot_url?: string;
}

export interface Project {
    metadata: ProjectMetadata;
    default: () => Component;
}