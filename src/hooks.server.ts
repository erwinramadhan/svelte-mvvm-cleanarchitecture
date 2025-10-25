import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { applyCSP } from '$lib/security/csp';

// Server-side middleware for authentication
const handleAuth: Handle = async ({ event, resolve }) => {
	// Skip authentication for auth routes
	const isAuthRoute = event.url.pathname.startsWith('/login') || 
										 event.url.pathname.startsWith('/register');
	
	if (isAuthRoute) {
		return resolve(event);
	}

	// For protected routes, check authentication status
	// In a real application, you would validate the token on the server here
	// For this demo, we just pass through to client-side auth
	return resolve(event);
};

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

// CSP middleware for XSS protection
const handleCSP: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	
	// Apply Content Security Policy header
	if (!response.headers.get('Content-Security-Policy')) {
		response.headers.set('Content-Security-Policy', applyCSP());
	}
	
	return response;
};

// Chain the handles
export const handle: Handle = handleCSP;
