<script lang="ts">
    import Gutter from "$lib/components/Gutter.svelte";
    import SiteLayout from "$lib/components/SiteLayout.svelte";
    import Nav from "$src/lib/components/Nav.svelte";
    import Prose from "$src/lib/ui/Prose.svelte";
    import { formatDate } from "$src/lib/utils/formatDate";
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();
</script>

<SiteLayout>
    <Gutter>
        <Nav />
        <h1 class="h1">{data.metadata.title}</h1>
        <date>{formatDate(data.metadata.date as string)}</date>
        <Prose>
            <data.Component />
        </Prose>
    </Gutter>
</SiteLayout>
