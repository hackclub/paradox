/**
 * Shared SEO type and defaults for the Paradox RSVP/landing page.
 * Pages can return `seo` from their load to override these defaults.
 */
export interface SeoData {
	title: string;
	description: string;
	ogImage?: string;
}

export const defaultSeo: SeoData = {
	title: 'RSVP for Paradox | Hack Club',
	description:
		'Paradox is a free 4-day build & performance residency in a London theatre, late June 2026. 50 teens build projects and perform live. By Hack Club. RSVP now.',
};
