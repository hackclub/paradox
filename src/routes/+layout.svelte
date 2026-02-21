<script>
import "../app.css";
import favicon from '$lib/assets/favicon.svg';
import { env } from '$env/dynamic/public';

let { children } = $props();

const umamiScriptUrl = env.PUBLIC_UMAMI_SCRIPT_URL;
const umamiWebsiteId = env.PUBLIC_UMAMI_WEBSITE_ID;</script>

<svelte:head>
	<link rel="icon" href="{favicon}" />
	{#if umamiScriptUrl && umamiWebsiteId}
		<!-- Umami analytics: page views and user behaviour -->
		<script defer src={umamiScriptUrl} data-website-id={umamiWebsiteId}></script>
	{/if}
</svelte:head>

{@render children()}
