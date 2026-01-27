<script lang="ts">
    const DEBUG = false;
    import type { Snippet } from "svelte";

    interface Props {
        children: Snippet;
    }
    let { children }: Props = $props();
</script>

<div class={`mx-auto max-w-[90ch] ${DEBUG && "border-accent border-2"}`}>
    {@render children()}
</div>
