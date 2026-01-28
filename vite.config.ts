import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { lint as lintSvx } from "./scripts/lint-posts";
import type { Plugin } from "vite";

export default defineConfig({
    plugins: [tailwindcss(), sveltekit(), svxLintPlugin()],
    build: {
        outDir: "dist",
    },
    test: {
        expect: { requireAssertions: true },
        projects: [
            {
                extends: "./vite.config.ts",
                test: {
                    name: "client",
                    browser: {
                        enabled: true,
                        provider: playwright(),
                        instances: [{ browser: "chromium", headless: true }],
                    },
                    include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
                    exclude: ["src/lib/server/**"],
                },
            },
            {
                extends: "./vite.config.ts",
                test: {
                    name: "server",
                    environment: "node",
                    include: ["src/**/*.{test,spec}.{js,ts}"],
                    exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"],
                },
            },
        ],
    },
});

function svxLintPlugin(): Plugin {
    return {
        name: "svx-lint",
        async handleHotUpdate({ file, server }) {
            if (file.endsWith(".svx")) {
                const { errors } = await lintSvx();
                if (errors.length > 0) {
                    server.ws.send({
                        type: "error",
                        err: {
                            message: errors.join("\n"),
                            plugin: "svx-lint",
                            stack: "",
                        },
                    });
                    return [];
                }
            }
        },
    };
}
