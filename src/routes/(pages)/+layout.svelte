<script lang="ts">
    import Gutter from "$src/lib/components/Gutter.svelte";
    import Nav from "$src/lib/components/Nav.svelte";
    import SiteLayout from "$src/lib/components/SiteLayout.svelte";
    import type { Snippet } from "svelte";

    interface Props {
        children: Snippet;
    }
    let { children }: Props = $props();
</script>

<SiteLayout>
    <Gutter>
        <Nav />
        {@render children()}
    </Gutter>
</SiteLayout>
