import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { Post } from '$lib/types'

export const load: PageLoad = async ({ params }) => {
    const { slug } = params;
    const FILES_GLOB = '/src/posts/*'
    const files = import.meta.glob('/src/posts/*.{md,svx}') as Record<string, () => Promise<Post>>
    
    // search for both .md and .svx files
    const mdPath = FILES_GLOB.replace('*', slug) + '.md'
    const svxPath = FILES_GLOB.replace('*', slug) + '.svx'

    const mdFileExists = files[mdPath]
    const svxFileExists = files[svxPath]
    
    if (!mdFileExists && !svxFileExists) {
        error(404, {
            message: "Not Found",
        })
    }
    
    // prioritize svx files
    // eslint-disable-next-line no-extra-boolean-cast
    const postPath = !!svxFileExists ? svxPath : mdPath;

    const { metadata, default: Component } = await files[postPath]()

    return {
        metadata,
        Component
    }
};