<script lang="ts">
    import Card from "$lib/ui/Card.svelte";
    import Head from "$src/lib/components/Head.svelte";
    import Main from "$src/lib/components/Main.svelte";
    import { formatDate } from "$src/lib/utils/formatDate";
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();
</script>

<Head title="blog" />

<Main>
    <h1 class="h1 my-8">Blog</h1>
    <div>
        <ul class="flex flex-col gap-4 max-w-[80ch] mx-auto">
            {#each data.posts as post}
                <Card
                    href={post.url}
                    title={post.data.metadata.title}
                    className="card card-hover cursor-pointer w-full preset-glass-neutral p-4"
                >
                    <date>{formatDate(post.data.metadata.date)}</date>
                    <p>{post.data.metadata.description}</p>
                </Card>
            {/each}
        </ul>
    </div>
</Main>
