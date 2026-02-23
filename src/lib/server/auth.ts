import { Elysia, t } from "elysia";

const HACKCLUB_AUTH_URL = "https://auth.hackclub.com";

export interface HackClubUser {
	id: string;
	email: string;
	name: string;
	username?: string;
	avatar?: string;
}

export const HackClubUserSchema = t.Object({
	id: t.String({ description: "Hack Club user ID" }),
	email: t.String({ description: "User email", format: "email" }),
	name: t.String({ description: "Display name" }),
	username: t.Optional(t.String({ description: "Username" })),
	avatar: t.Optional(t.String({ description: "Avatar URL" })),
});

export const MeResponseSchema = t.Object({
	user: t.Union([HackClubUserSchema, t.Null()], {
		description: "Authenticated user or null if not authenticated",
	}),
});

export const authPlugin = new Elysia({ prefix: "/auth" })
	.get("/login", ({ redirect }) => {
		const params = new URLSearchParams({
			client_id: process.env.HACKCLUB_CLIENT_ID!,
			redirect_uri: process.env.HACKCLUB_REDIRECT_URI!,
			response_type: "code",
			scope: "openid profile email",
		});
		return redirect(`${HACKCLUB_AUTH_URL}/oauth/authorize?${params}`);
	}, {
		response: {
			302: t.String({ description: "Redirect to Hack Club OAuth authorize URL" }),
		},
		detail: {
			tags: ["Auth"],
			summary: "Login",
			description: "Redirects the user to Hack Club OAuth to begin the login flow.",
		},
	})

	.get(
		"/callback",
		async ({ query, cookie, redirect }) => {
			const { code } = query;
			const origin = process.env.ORIGIN ?? "http://localhost:5173";

			if (!code) {
				return redirect(`${origin}/?error=no_code`);
			}

			// Exchange authorization code for access token
			// OAuth 2.0 spec (RFC 6749) requires application/x-www-form-urlencoded
			const tokenRes = await fetch(`${HACKCLUB_AUTH_URL}/oauth/token`, {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({
					client_id: process.env.HACKCLUB_CLIENT_ID!,
					client_secret: process.env.HACKCLUB_CLIENT_SECRET!,
					redirect_uri: process.env.HACKCLUB_REDIRECT_URI!,
					code,
					grant_type: "authorization_code",
				}),
			});

			if (!tokenRes.ok) {
				return redirect(`${origin}/?error=token_exchange_failed`);
			}

			const { access_token } = (await tokenRes.json()) as {
				access_token: string;
			};

			// Store access token in httpOnly cookie
			cookie.access_token.set({
				value: access_token,
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
				maxAge: 60 * 60 * 24 * 7, // 7 days
			});

			return redirect(origin);
		},
		{
			query: t.Object({
				code: t.Optional(t.String()),
				error: t.Optional(t.String()),
			}),
			detail: {
				tags: ["Auth"],
				summary: "OAuth Callback",
				description: "Handles the Hack Club OAuth callback. Exchanges the authorization code for an access token and sets it as an httpOnly cookie. Redirects to origin with ?error=no_code or ?error=token_exchange_failed on failure.",
				hide: true,
				responses: {
					302: { description: "Redirect to origin on success, or to origin with ?error=no_code | ?error=token_exchange_failed on failure" },
				},
			},
		}
	)

	.get("/me", async ({ headers }) => {
		const auth = headers.authorization;
		if (!auth?.startsWith("Bearer ")) {
			return { user: null };
		}

		const token = auth.slice(7);
		const res = await fetch(`${HACKCLUB_AUTH_URL}/api/v1/me`, {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!res.ok) {
			return { user: null };
		}

		return { user: (await res.json()) as HackClubUser };
	}, {
		response: {
			200: MeResponseSchema,
		},
		detail: {
			tags: ["Auth"],
			summary: "Get current user",
			description: "Returns the currently authenticated user from the Bearer token. Returns null if unauthenticated.",
			security: [{ bearerAuth: [] }],
		},
	})

	.get("/logout", ({ cookie, redirect }) => {
		const origin = process.env.ORIGIN ?? "http://localhost:5173";
		cookie.access_token.remove();
		return redirect(origin);
	}, {
		response: {
			302: t.String({ description: "Redirect to origin after clearing session" }),
		},
		detail: {
			tags: ["Auth"],
			summary: "Logout",
			description: "Clears the session cookie and redirects the user home.",
		},
	});
