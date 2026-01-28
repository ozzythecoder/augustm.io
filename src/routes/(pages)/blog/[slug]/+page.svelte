<script lang="ts">
    import Head from "$src/lib/components/Head.svelte";
    import Main from "$src/lib/components/Main.svelte";
    import Prose from "$src/lib/ui/Prose.svelte";
    import { formatDate } from "$src/lib/utils/formatDate";
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();
</script>

<Head title={data.metadata.title} />

<Main>
    <section>
        <header class="flex flex-col gap-1">
            <h1 class="h1">{data.metadata.title}</h1>
            <date class="italic text-surface-200"
                >{formatDate(data.metadata.date)}</date
            >
            <nav class="flex flex-row gap-1 flex-wrap">
                {#each data.metadata.tags as tag}
                    <a
                        href={`/blog?tag=${tag}`}
                        class="chip preset-filled-surface-200-800"
                    >
                        {tag}
                    </a>
                {/each}
            </nav>
            <p class="h4 text-surface-200">{data.metadata.description}</p>
        </header>
        <Prose>
            <data.Component />
        </Prose>
    </section>
</Main>
