<script>
    import Gutter from "$lib/components/Gutter.svelte";
    import Nav from "$lib/components/Nav.svelte";
    import SiteLayout from "$lib/components/SiteLayout.svelte";
</script>

<SiteLayout>
    <Gutter>
        <main id="main" tabindex="-1">
            <Nav />
            <section>
                <header class="min-h-[80dvh] flex flex-col items-center justify-center gap-4">
                    <h1 class="h1 text-8xl">august m</h1>
                    <p class="text-2xl tracking-wide text-text-200 font-mono">
                        i make things for humans.
                    </p>
                </header>
            </section>
        </main>
    </Gutter>
</SiteLayout>
