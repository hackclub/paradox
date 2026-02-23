import type { LayoutServerLoad } from './$types';
import { defaultSeo } from '$lib/seo';

export const load: LayoutServerLoad = ({ locals }) => {
	return {
		user: locals.user,
		seo: defaultSeo
	};
};
