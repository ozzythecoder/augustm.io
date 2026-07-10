<script lang="ts">
    import { FolderGit2 } from "@lucide/svelte";
    
    import Head from "$src/lib/components/Head.svelte";
    import Main from "$src/lib/components/Main.svelte";
    import Card from "$src/lib/ui/Card.svelte";
    import type { PageProps } from "./$types";

    const PAGE_TITLE = "Software Projects";

    const { data }: PageProps = $props();
</script>

<Head title={PAGE_TITLE.toLowerCase()} />
<Main>
    <h1 class="h1">{PAGE_TITLE}</h1>

    <ul class="grow mt-8 overflow-y-scroll flex flex-col gap-8 snap-y snap-proximity">
        {#each data.projects as project}
            <li class="snap-start">
                <Card
                    className="card preset-glass-secondary p-8 relative flex flex-col gap-1"
                >
                    
                    <div class="flex flex-row gap-4 items-baseline">
                        <h2 class="h3">{project.metadata.title}</h2>
                        {#if project.metadata.github}
                            <a
                                href={project.metadata.github}
                                target="_blank"
                                title="See source code on GitHub"
                            >
                                <span class="sr-only"
                                    >Source code on GitHub</span
                                >
                                <FolderGit2
                                    size="24"
                                    class="text-surface-800-200 hover:text-surface-950-50 -mb-0.5"
                                />
                            </a>
                        {/if}
                    </div>

                    {#if project.metadata.client}
                        <h5 class="text-surface-900-100 text-lg font-semibold">
                            {project.metadata.client}
                        </h5>
                    {/if}

                    <date class="italic text-surface-800-200">
                        {project.metadata.start_date}
                        {#if project.metadata.end_date}
                            {" - " + project.metadata.end_date}
                        {/if}
                    </date>

                    <ul id="tag-list" class="flex flex-row flex-wrap gap-2">
                        {#each project.metadata.tags as tag}
                            <li class="inline">
                                <span class="chip preset-filled-surface-100-900"
                                    >{tag}</span
                                >
                            </li>
                        {/each}
                    </ul>

                    <p class="prose-blog pb-0 mx-0">
                        <project.default />
                    </p>
                </Card>
            </li>
        {/each}
    </ul>
    
</Main>
