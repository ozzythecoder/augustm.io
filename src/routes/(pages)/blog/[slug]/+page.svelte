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
    <h1 class="h1">{data.metadata.title}</h1>
    <date>{formatDate(data.metadata.date as string)}</date>
    <Prose>
        <data.Component />
    </Prose>
</Main>
