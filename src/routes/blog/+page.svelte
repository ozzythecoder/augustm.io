<script lang="ts">
    import Gutter from "$lib/components/Gutter.svelte";
    import Nav from "$lib/components/Nav.svelte";
    import SiteLayout from "$lib/components/SiteLayout.svelte";
    import Card from "$lib/ui/Card.svelte";
    import { formatDate } from "$src/lib/utils/formatDate";
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();
</script>

<SiteLayout>
    <Gutter>
        <Nav />
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
    </Gutter>
</SiteLayout>
