<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();
</script>

<article class={"prose-blog"}>
    {@render children()}
</article>

<style>
    article :global(figure) {
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        max-width: 100%;

        :global(div.img-container) {
            position: relative;
            margin-inline: auto;
            width: 100%;
            max-width: 60ch;
            height: 400px;
            border: 1px solid var(--color-surface-900);
            box-shadow: 0 4px 4rem var(--color-surface-700);

            :global(img) {
                position: absolute;
                top: 0;
                left: 0;
                margin: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }
</style>
