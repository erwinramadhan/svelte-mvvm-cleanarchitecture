import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

const isProtectedRoute = (pathname: string) =>
	!pathname.startsWith('/login') &&
	!pathname.startsWith('/register') &&
	!pathname.startsWith('/reset-password') &&
	!pathname.startsWith('/forgot-password');

export const load: LayoutLoad = async ({ url }) => {
	// On the server we can't read localStorage, so let the client-side check handle redirect
	if (!browser) return {};

	const hasToken = Boolean(localStorage.getItem('auth_token'));
	if (!hasToken && isProtectedRoute(url.pathname)) {
		throw redirect(307, '/login');
	}

	return {};
};
