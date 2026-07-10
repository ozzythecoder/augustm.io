<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        children: Snippet;
    }
    let { children }: Props = $props();
</script>

<main id="main" class="h-full flex flex-col" tabindex="-1">
    {@render children()}
</main>
