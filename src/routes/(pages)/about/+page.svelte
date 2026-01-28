<script lang="ts">
    import Head from "$src/lib/components/Head.svelte";
    import Main from "$src/lib/components/Main.svelte";

    const TITLE = "About";
</script>

<Head title={TITLE.toLowerCase()} />
<Main>
    <h1 class="h1">{TITLE}</h1>
    <p>Under construction</p>
</Main>
