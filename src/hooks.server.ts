import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';

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

// Chain the handles
export const handle: Handle = handleAuth;
