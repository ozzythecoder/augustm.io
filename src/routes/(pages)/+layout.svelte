<script lang="ts">
    import Gutter from "$src/lib/components/Gutter.svelte";
    import Nav from "$src/lib/components/Nav.svelte";
    import SiteLayout from "$src/lib/components/SiteLayout.svelte";
    import type { Snippet } from "svelte";
    import { page } from "$app/state";
    import { fade } from "svelte/transition";

    interface Props {
        children: Snippet;
    }
    let { children }: Props = $props();
</script>

<SiteLayout>
    <Gutter>
        <div class="flex flex-col min-h-screen">
            <Nav />
            <div class="grow relative">
                {#key page.url.pathname}
                    <div
                        class="absolute inset-0 flex flex-col"
                        in:fade={{ duration: 200 }}
                        out:fade={{ duration: 200 }}
                    >
                        {@render children()}
                    </div>
                {/key}
            </div>
        </div>
    </Gutter>
</SiteLayout>
