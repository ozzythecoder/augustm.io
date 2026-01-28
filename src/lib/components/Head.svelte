<script lang="ts">
    interface Props {
        title?: string;
        noConcat?: boolean;
    }

    const { title, noConcat = false }: Props = $props();

    const pageTitle = $derived(
        title ? (noConcat ? title : `${title} | augustm`) : "augustm",
    );
</script>

<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>
