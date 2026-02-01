import { mdsvex } from "mdsvex";
import adapter from "@sveltejs/adapter-static";
import rehypeHighlight from "rehype-highlight";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter(),
        alias: {
            "$src/*": "./src/*",
        },
        prerender: {
            handleUnseenRoutes: "warn"
        }
    },
    preprocess: [
        mdsvex({
            extensions: [".md", ".svx"],
            rehypePlugins: [rehypeHighlight],
        }),
    ],
    extensions: [".svelte", ".svx", ".md"],
};

export default config;
