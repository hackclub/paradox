import type { Handle } from "@sveltejs/kit";
import type { HackClubUser } from "./app";

const HACKCLUB_AUTH_URL = "https://auth.hackclub.com";

const UMAMI_API_URL = process.env.UMAMI_API_URL;
const UMAMI_WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;

/** Send an event to Umami's server-side API (fire-and-forget). */
function trackApiRequest(request: Request): void {
	if (!UMAMI_API_URL || !UMAMI_WEBSITE_ID) return;

	const url = new URL(request.url);
	if (!url.pathname.startsWith("/api")) return;

	fetch(`${UMAMI_API_URL}/api/send`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"User-Agent": request.headers.get("user-agent") ?? "unknown",
		},
		body: JSON.stringify({
			type: "event",
			payload: {
				website: UMAMI_WEBSITE_ID,
				url: url.pathname + url.search,
				hostname: url.hostname,
				name: "api-request",
				data: { method: request.method, path: url.pathname },
			},
		}),
	}).catch((err) => {
		if (process.env.NODE_ENV !== "production") {
			console.debug("[umami] Failed to send tracking event:", err);
		}
	});
}

export const handle: Handle = async ({ event, resolve }) => {
	trackApiRequest(event.request);

	const accessToken = event.cookies.get("access_token");

	if (accessToken) {
		const res = await fetch(`${HACKCLUB_AUTH_URL}/api/v1/me`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		if (res.ok) {
			event.locals.user = (await res.json()) as HackClubUser;
		} else {
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};
