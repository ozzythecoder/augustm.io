<script lang="ts">
    import { dev } from "$app/environment";
    import Head from "$src/lib/components/Head.svelte";
    import Main from "$src/lib/components/Main.svelte";
    import Prose from "$src/lib/ui/Prose.svelte";
    import { formatDate } from "$src/lib/utils/formatDate";
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();
</script>

<Head {...data.ogData} />

{#if dev && data.wordCount}
    <div
        class="fixed top-0 left-0 right-0 bg-warning-500 text-warning-950 text-center py-1 text-sm font-mono z-50"
    >
        Word count: {data.wordCount}
    </div>
{/if}

<Main>
    <section>
        <header class="flex flex-col gap-2 mb-8">
            {#if data.metadata.draft}
                <span class="text-surface-950 chip bg-red-500 max-w-fit"
                    >Draft</span
                >
            {/if}
            <h1 class="h1">{data.metadata.title}</h1>
            <date class="italic text-surface-800-200"
                >{formatDate(data.metadata.date)}</date
            >
            <nav class="flex flex-row gap-1 flex-wrap">
                {#each data.metadata.tags || [] as tag}
                    <a
                        href={`/blog?tag=${tag}`}
                        class="chip preset-filled-surface-200-800"
                    >
                        {tag}
                    </a>
                {/each}
            </nav>
            <p class="h4 text-surface-800-200">{data.metadata.description}</p>
        </header>
        <Prose>
            <data.Component />
        </Prose>
    </section>
</Main>
