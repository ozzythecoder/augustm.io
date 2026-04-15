<script lang="ts">
    import { goto } from "$app/navigation";
    import type { Snippet } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";

    type Props = {
        titleClass?: string;
        className?: string;
        href?: string;
        title?: string;
        children: Snippet;
    } & HTMLAttributes<HTMLDivElement>;
    const {
        href,
        title,
        titleClass,
        className,
        children,
        ...restProps
    }: Props = $props();

    // buncha code to make block link accessible & allow nested links
    let cardEl: HTMLDivElement;
    let linkEl = $state<HTMLAnchorElement>();

    $effect(() => {
        
        function clickLink(e: MouseEvent) {
            const textIsSelected = window.getSelection()?.toString();
            if (!textIsSelected && !!linkEl && href) {
                console.log(href)
                // respect modifier keys and open in a new tab
                if (e.ctrlKey || e.metaKey || e.shiftKey) {
                    window.open(href, "_blank");
                } else if (!href.startsWith("/")) {
                    // open external links in a new tab
                    window.open(href, "_blank");
                } else {
                    // programmatic navigation to refresh app state
                    goto(href);
                }
            }
        }

        cardEl.addEventListener("click", clickLink);

        const clickableElements = Array.from(cardEl.querySelectorAll("a"));
        clickableElements.forEach((ele) =>
            ele.addEventListener("click", (e) => e.stopPropagation()),
        );

        return () => {
            cardEl.removeEventListener("click", clickLink);
            clickableElements.forEach((ele) =>
                ele.removeEventListener("click", (e) => e.stopPropagation()),
            );
        };
    });
</script>

<div
    bind:this={cardEl}
    class={`card ${className} ${href ? "card-hover" : ""}`}
    {...restProps}
>
    <h2 class={titleClass ?? "h2"}>
        {#if href}
            <a {href} bind:this={linkEl}>{title}</a>
        {:else}
            {title}
        {/if}
    </h2>
    {@render children()}
</div>
