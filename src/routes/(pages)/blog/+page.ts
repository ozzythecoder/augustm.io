import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Post } from '$src/lib/types';

export const load: PageLoad = async () => {
    const files = import.meta.glob('$src/posts/*.{md,svx}') as Record<string, () => Promise<Post>>;

    if (!files) {
        error(500, {
            message: 'august did a booboo',
        });
    }

    const promiseItems = Object.entries(files).map(async ([name, getData]) => {
        return {
            name,
            data: await getData(),
            url: "/blog" + name.slice(name.lastIndexOf("/"), name.lastIndexOf("."))
        };
    });

    const items = await Promise.all(promiseItems);
    
    console.log(items.map(e => e.name))

    return {
        posts: items.sort((a, b) => {
            const dateA = new Date(a.data.metadata.date as string);
            const dateB = new Date(b.data.metadata.date as string);
            return dateB.getTime() - dateA.getTime();
        })
    };
};