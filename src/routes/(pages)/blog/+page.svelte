<script lang="ts">
    import { page } from "$app/state";
    import Card from "$lib/ui/Card.svelte";
    import Head from "$src/lib/components/Head.svelte";
    import Main from "$src/lib/components/Main.svelte";
    import { formatDate, getEpochTime } from "$src/lib/utils/formatDate";
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();

    let activeTag = $state<string | null>(null);
    let sort = $state<string | null>(null);

    // wrapped in effect to assist with prerendering
    $effect(() => {
        activeTag = page.url.searchParams.get("tag");
        sort = page.url.searchParams.get("sort");
    });

    const filteredPosts = $derived(
        !!activeTag
            ? data.posts.filter((p) =>
                  p.data.metadata.tags?.includes(activeTag),
              )
            : data.posts,
    );

    const sortedPosts = $derived(
        sort === "oldest"
            ? [...filteredPosts].sort(
                  (a, b) =>
                      getEpochTime(a.data.metadata.date, true) -
                      getEpochTime(b.data.metadata.date, true),
              )
            : [...filteredPosts].sort(
                  (a, b) =>
                      getEpochTime(b.data.metadata.date, true) -
                      getEpochTime(a.data.metadata.date, true),
              ),
    );

    const allTags = $derived([
        ...new Set(data.posts.flatMap((p) => p.data.metadata.tags ?? [])),
    ]);
</script>

<Head title="blog" />

<Main>
    <h1 class="h1 my-4 sm:my-8">Blog</h1>
    <div class="flex mb-4 flex-col-reverse gap-4 sm:flex-row">
        <div
            id="tag-selector"
            class="flex gap-2 flex-nowrap overflow-x-scroll sm:flex-wrap sm:overflow-x-auto flex-5"
        >
            <a
                href="/blog"
                data-active={!activeTag}
                class="chip preset-outlined-success-200-800 data-[active='true']:preset-filled-success-200-800"
                >all</a
            >
            {#each allTags as tag}
                <a
                    href={tag === activeTag ? "blog" : `/blog?tag=${tag}`}
                    data-active={activeTag === tag}
                    class="chip preset-outlined-primary-200-800 data-[active='true']:preset-filled-primary-200-800"
                    >{tag}</a
                >
            {/each}
        </div>
        <div id="sort-selector" class="flex items-baseline gap-2 flex-1">
            <p class="text-sm pr-2 text-primary-300 hidden sm:block">Sort</p>
            <a
                href="/blog"
                data-active={sort !== "oldest"}
                class="chip data-[active='false']:preset-outlined-primary-500 data-[active='true']:preset-tonal-primary"
                >Newest</a
            >
            <a
                href="/blog?sort=oldest"
                data-active={sort === "oldest"}
                class="chip data-[active='false']:preset-outlined-primary-500 data-[active='true']:preset-tonal-primary"
                >Oldest</a
            >
        </div>
    </div>
    <div>
        {#if sortedPosts.length === 0}
            <h3>No posts found.</h3>
        {:else}
            <ul class="flex flex-col gap-4 max-w-[80ch] mx-auto">
                {#each sortedPosts as post}
                    <Card
                        href={post.url}
                        title={post.data.metadata.title}
                        className="card card-hover cursor-pointer w-full preset-glass-neutral p-4"
                    >
                        <date class="italic text-surface-200"
                            >{formatDate(post.data.metadata.date)}</date
                        >
                        <p>{post.data.metadata.description}</p>
                    </Card>
                {/each}
            </ul>
        {/if}
    </div>
</Main>
