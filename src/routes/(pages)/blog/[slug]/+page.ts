import { error } from "@sveltejs/kit";
import { dev } from "$app/environment";
import type { PageLoad } from "./$types";
import type { Post } from "$lib/types";

export const load: PageLoad = async ({ params }) => {
    const { slug } = params;
    const FILES_GLOB = "/src/posts/*";
    const files = import.meta.glob("/src/posts/*.{md,svx}") as Record<
        string,
        () => Promise<Post>
    >;
    const rawFiles = import.meta.glob("/src/posts/*.{md,svx}", {
        query: "?raw",
        import: "default",
    }) as Record<string, () => Promise<string>>;

    // search for both .md and .svx files
    const mdPath = FILES_GLOB.replace("*", slug) + ".md";
    const svxPath = FILES_GLOB.replace("*", slug) + ".svx";

    const mdFileExists = files[mdPath];
    const svxFileExists = files[svxPath];

    if (!mdFileExists && !svxFileExists) {
        error(404, {
            message: "Not Found",
        });
    }

    // prioritize svx files
    const postPath = !!svxFileExists ? svxPath : mdPath;

    const { metadata, default: Component } = await files[postPath]();

    let wordCount: number | undefined;
    if (dev) {
        const rawContent = await rawFiles[postPath]();

        const contentWithoutFrontmatter = rawContent.replace(
            /^---[\s\S]*?---\n*/,
            "",
        );

        wordCount = contentWithoutFrontmatter
            .split(/\s+/)
            .filter((word) => word.length > 0).length;
    }

    return {
        metadata,
        Component,
        wordCount,
    };
};
