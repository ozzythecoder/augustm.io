import { dev } from "$app/environment";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { Post } from "$src/lib/types";

export const load: PageLoad = async () => {
    const files = import.meta.glob("$src/posts/*.{md,svx}") as Record<
        string,
        () => Promise<Post>
    >;

    if (!files) {
        error(500, {
            message: "august did a booboo",
        });
    }

    const promiseItems = Object.entries(files).map(async ([name, getData]) => {
        return {
            name,
            data: await getData(),
            url:
                "/blog" +
                name.slice(name.lastIndexOf("/"), name.lastIndexOf(".")),
        };
    });

    const items = await Promise.all(promiseItems);
    const posts = items
        // sort by most recent first
        .sort((a, b) => {
            const dateA = new Date(a.data.metadata.date);
            const dateB = new Date(b.data.metadata.date);
            return dateB.getTime() - dateA.getTime();
        })
        // exclude drafts in production
        .filter((post) => {
            return dev || !post.data.metadata.draft;
        });

    return {
        posts,
    };
};
