<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        children: Snippet;
    }
    let { children }: Props = $props();
</script>

<div id="container" class="min-h-screen pt-8">
    {@render children()}
</div>
