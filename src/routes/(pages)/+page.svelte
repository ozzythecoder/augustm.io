<script lang="ts">
    import AnimatedTitle from "$src/lib/components/AnimatedTitle.svelte";
    import Head from "$src/lib/components/Head.svelte";
</script>

<Head ogDescription="I make things for humans." />
<section class="grow-0 mt-48 sm:mt-0 sm:grow grid place-items-center">
    <header class="flex flex-col items-center justify-center gap-4">
        <AnimatedTitle />
        <p class="text-xl sm:text-2xl tracking-wide text-text-200 font-mono">
            i make things for humans.
        </p>
    </header>
</section>
