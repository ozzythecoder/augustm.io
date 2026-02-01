<script lang="ts">
    interface Props {
        title?: string;
        noConcat?: boolean;
        metaDescription?: string;
        image?: string;
    }

    const { title, metaDescription, image, noConcat = false }: Props = $props();

    const pageTitle = $derived(
        title ? (noConcat ? title : `${title} | augustm`) : "augustm",
    );
</script>

<svelte:head>
    <title>{pageTitle}</title>
    <meta name="og:description" content={metaDescription} />
    <meta name="og:image" content={image} />
    <link rel="icon" href="/favicon.ico" />
</svelte:head>
