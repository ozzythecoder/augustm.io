<script lang="ts">
    const PAGE_TITLE = "Projects";

    import Head from "$src/lib/components/Head.svelte";
    import Main from "$src/lib/components/Main.svelte";
    import Card from "$src/lib/ui/Card.svelte";
    import { Code, Music, Pen } from "@lucide/svelte";

    import { fade } from "svelte/transition";

    const flavorText = {
        software: "tools, toys, and the pursuit of idempotency",
        music: "my collection of time decorations",
        writing: "making sense of this whole mess",
    } as const;

    let flavorTextDisplay = $state<string>("");

    function handleFocus(which: keyof typeof flavorText | null) {
        flavorTextDisplay = which ? flavorText[which] : "";
    }

    function handleBlur() {
        handleFocus(null);
    }
</script>

<Head title={PAGE_TITLE.toLowerCase()} />
<Main>
    <ul class="flex flex-col items-stretch grow py-2 sm:grid sm:grid-cols-3 gap-2 sm:gap-6 sm:items-center">
        <Card
            className="grow focus-within:brightness-90 dark:focus-within:brightness-110 cursor-pointer preset-glass-secondary flex flex-col items-center text-center justify-center py-6 sm:aspect-square"
            title="Software"
            titleClass="font-code h4"
            href="/projects/software"
            onmouseenter={() => handleFocus("software")}
            onfocusin={() => handleFocus("software")}
            onmouseleave={handleBlur}
            onfocusout={handleBlur}
        >
            <span class="py-2 block font-heading sm:hidden">{flavorText["software"]}</span>
            <Code size="32" />
        </Card>
        <Card
            className="grow focus-within:brightness-90 dark:focus-within:brightness-110 cursor-pointer preset-glass-primary flex flex-col items-center text-center justify-center py-6 sm:aspect-square"
            title="Music"
            titleClass="font-base tracking-widest h4"
            href="http://solo.to/ozzythepainter"
            onmouseenter={() => handleFocus("music")}
            onfocusin={() => handleFocus("music")}
            onmouseleave={handleBlur}
            onfocusout={handleBlur}
        >
            <span class="py-2 block font-heading sm:hidden">{flavorText["music"]}</span>
            <Music size="32" />
        </Card>
        <Card
            className="grow focus-within:brightness-90 dark:focus-within:brightness-110 cursor-pointer preset-glass-tertiary flex flex-col items-center text-center justify-center py-6 sm:aspect-square"
            title="Writing"
            titleClass="tracking-wider h4"
            href="/blog"
            onmouseenter={() => handleFocus("writing")}
            onfocusin={() => handleFocus("writing")}
            onmouseleave={handleBlur}
            onfocusout={handleBlur}
        >
            <span class="py-2 block font-heading sm:hidden">{flavorText["writing"]}</span>
            <Pen size="32" />
        </Card>
    </ul>

    {#key flavorTextDisplay}
        <p
            in:fade={{ duration: 100 }}
            class="h2 text-xl font-normal min-h-16 py-4 text-right hidden sm:block"
        >
            {flavorTextDisplay}
        </p>
    {/key}
</Main>
