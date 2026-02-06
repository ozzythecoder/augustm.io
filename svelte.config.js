import { mdsvex } from "mdsvex";
import adapter from "@sveltejs/adapter-static";
import rehypeHighlight from "rehype-highlight";
import { pictureWrapper } from "./rehype/pictureWrapper.js";
import { visit } from "unist-util-visit";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter(),
        alias: {
            "$src/*": "./src/*",
        },
        prerender: {
            handleUnseenRoutes: "warn",
        },
    },
    preprocess: [
        mdsvex({
            extensions: [".md", ".svx"],
            rehypePlugins: [rehypeHighlight, pictureWrapper],
        }),
    ],
    extensions: [".svelte", ".svx", ".md"],
};

export default config;
