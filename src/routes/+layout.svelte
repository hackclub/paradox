<script>
	import '../app.css';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const seo = $derived(page.data.seo ?? { title: 'RSVP for Paradox | Hack Club', description: 'Paradox is a free 4-day build & performance residency in a London theatre, late June 2026. 50 teens build projects and perform live. By Hack Club. RSVP now.' });
	const canonicalUrl = $derived(page.url.origin + page.url.pathname);
	const ogImage = $derived(seo.ogImage ?? page.url.origin + '/images/Paradox.png');

	const eventJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'Event',
		name: 'Paradox',
		description: seo.description,
		startDate: '2026-06-25',
		endDate: '2026-06-29',
		eventStatus: 'https://schema.org/EventScheduled',
		eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
		location: {
			'@type': 'Place',
			name: 'London (venue TBC)',
			address: { '@type': 'PostalAddress', addressLocality: 'London' }
		},
		organizer: {
			'@type': 'Organization',
			name: 'Hack Club',
			url: 'https://hackclub.com'
		},
		image: ogImage,
		url: canonicalUrl
	});
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={ogImage} />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content={ogImage} />

	<link rel="icon" href="{favicon}" />

	<!-- JSON-LD Event for rich results -->
	{@html `<script type="application/ld+json">${JSON.stringify(eventJsonLd).replace(/<\/script>/gi, '<\\/script>')}</script>`}
</svelte:head>

{@render children()}
