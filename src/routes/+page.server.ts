import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const origin = url.origin;

	return {
		seo: {
			title: 'RSVP for Paradox – 4-Day Build & Performance Residency | Hack Club',
			description:
				'Paradox is a free 4-day build & performance residency in a London theatre, late June 2026. 50 teens build projects and perform live. By Hack Club. RSVP now.',
			ogImage: `${origin}/images/Paradox.png`
		}
	};
};
