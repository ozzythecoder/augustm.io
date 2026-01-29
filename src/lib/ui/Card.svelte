<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        href?: string;
        title: string;
        className?: string;
        children: Snippet;
    }
    const { href, title, className, children }: Props = $props();

    // buncha code to make block link accessible & allow nested links
    // 
    let cardEl: HTMLDivElement;
    let linkEl = $state<HTMLAnchorElement>() 

    $effect(() => {
        function clickLink() {
            const textIsSelected = window.getSelection()?.toString();
            if (!textIsSelected && !!linkEl) {
                linkEl.click();
            }
        }
        
        cardEl.addEventListener("click", clickLink);
        
        const clickableElements = Array.from(cardEl.querySelectorAll("a"));
        clickableElements.forEach((ele) =>
          ele.addEventListener("click", (e) => e.stopPropagation())
        );       
        
        return () => {
            cardEl.removeEventListener("click", clickLink)
            clickableElements.forEach((ele) =>
              ele.removeEventListener("click", (e) => e.stopPropagation())
            );       
        }
    });
</script>

<div bind:this={cardEl} class={`card ${className} ${href ? "card-hover" : ""}`}>
    <h2 class="h2">
        {#if href}
            <a {href} bind:this={linkEl}>{title}</a>
        {:else}
            {title}
        {/if}
    </h2>
    {@render children()}
</div>
