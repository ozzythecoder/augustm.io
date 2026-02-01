<script lang="ts">
    interface Props {
        title?: string;
        noConcat?: boolean;
        ogDescription?: string;
        ogImage?: string;
        ogUrl?: string;
    }

    const { title, ogDescription, ogUrl, ogImage = "/android-chrome-512x512.png", noConcat = false }: Props = $props();

    const pageTitle = $derived(
        title ? (noConcat ? title : `${title} | augustm`) : "augustm",
    );
</script>

<svelte:head>
    <title>{pageTitle}</title>
    <meta name="og:title" content={pageTitle} />
    <meta name="og:description" content={ogDescription} />
    <meta name="og:image" content={ogImage} />
    <meta name="og:url" content={ogUrl} />
    <link rel="icon" href="/favicon.ico" />
</svelte:head>
