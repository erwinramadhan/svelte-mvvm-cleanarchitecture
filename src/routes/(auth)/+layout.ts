import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	if (!browser) return {};

	const hasToken = Boolean(localStorage.getItem('auth_token'));
	if (hasToken) {
		throw redirect(307, '/');
	}

	return {};
};
