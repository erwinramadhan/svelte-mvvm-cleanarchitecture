/**
 * Content Security Policy (CSP) configuration for XSS protection
 */

// Define the CSP header value
export const CSP_HEADER = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https:;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`;

/**
 * Function to apply CSP header in SvelteKit hooks
 */
export function applyCSP(): string {
	// Clean up the CSP string by removing extra whitespace and newlines
	return CSP_HEADER.replace(/\n\s*/g, ' ').trim();
}

/**
 * Function to validate if a token is properly formatted
 */
export function validateTokenFormat(token: string): boolean {
	// Basic validation for JWT format: header.payload.signature
	if (!token) return false;

	// Check if token follows JWT format with 2 dots
	const parts = token.split('.');
	if (parts.length !== 3) return false;

	// Check if each part is base64url encoded
	const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
	return jwtRegex.test(token);
}
