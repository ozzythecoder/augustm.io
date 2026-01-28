<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        children: Snippet;
    }
    let { children }: Props = $props();
</script>

<main id="main" tabindex="-1">
    {@render children()}
</main>
