import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { Project } from "$src/lib/types";
import { parseFullDateFromMonth } from "$src/lib/utils/formatDate";

export const load: PageLoad = async () => {
    const files = import.meta.glob(
        "$src/content/projects/*.{md,svx}",
    ) as Record<string, () => Promise<Project>>;

    if (!files) {
        error(500, {
            message: "No projects found",
        });
    }

    const promiseItems = Object.values(files).map(
        async (getData) => await getData(),
    );

    const items = await Promise.all(promiseItems);
    const projects = items
        .sort((a, b) => {
            const dateA = parseFullDateFromMonth(a.metadata.start_date);
            const dateB = parseFullDateFromMonth(b.metadata.start_date);
            return dateB.getTime() - dateA.getTime();
        })
        .sort((a, b) => {
            const priA = parseInt(a.metadata.priority ?? "1000");
            const priB = parseInt(b.metadata.priority ?? "1000");
            
            return priA - priB; // smaller number = higher priority
        })
        .filter((e) => e.metadata.categories.includes("software"));

    return {
        projects,
    };
};
