import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { Project } from "$src/lib/types";

export const load: PageLoad = async () => {
    const files = import.meta.glob(
        "$src/content/projects/*.{md,svx}",
    ) as Record<string, () => Promise<Project>>;

    if (!files) {
        error(500, {
            message: "No projects found",
        });
    }

    const promiseItems = Object.values(files).map(async (getData) => await getData());

    const items = await Promise.all(promiseItems);
    const projects = items.sort((a, b) => {
        const dateA = new Date(a.metadata.start_date);
        const dateB = new Date(b.metadata.start_date);
        return dateB.getTime() - dateA.getTime();
    });

    return {
        projects,
    };
};
