<script lang="ts">
	import './app.css';
	import "@fontsource-variable/overpass-mono";
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
