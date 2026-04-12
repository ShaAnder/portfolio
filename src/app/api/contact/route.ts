export const runtime = "nodejs";

function isValidEmail(email: string) {
	const value = email.trim();
	if (!value) return false;
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function json(message: string, status = 200) {
	return Response.json(
		{ ok: status >= 200 && status < 300, message },
		{ status },
	);
}

export async function POST(req: Request) {
	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return json("Invalid request body.", 400);
	}

	if (!body || typeof body !== "object") {
		return json("Invalid request body.", 400);
	}

	const payload = body as Record<string, unknown>;
	const rawFirstName = payload.firstName;
	const rawLastName = payload.lastName;
	const rawName = payload.name;
	const rawEmail = payload.email;
	const rawService = payload.service;
	const rawMessage = payload.message;

	const firstName = typeof rawFirstName === "string" ? rawFirstName.trim() : "";
	const lastName = typeof rawLastName === "string" ? rawLastName.trim() : "";
	const legacyName = typeof rawName === "string" ? rawName.trim() : "";
	const email = typeof rawEmail === "string" ? rawEmail.trim() : "";
	const service = typeof rawService === "string" ? rawService.trim() : "";
	const message = typeof rawMessage === "string" ? rawMessage.trim() : "";

	const name =
		firstName || lastName ? `${firstName} ${lastName}`.trim() : legacyName;

	if (name.length < 2 || name.length > 120)
		return json("Please provide a valid name.", 400);
	if (firstName.length > 60 || lastName.length > 60)
		return json("Please provide a valid name.", 400);
	if (!isValidEmail(email) || email.length > 254)
		return json("Please provide a valid email.", 400);
	if (service.length > 100) return json("Please choose a valid service.", 400);
	if (message.length < 10 || message.length > 5000)
		return json("Please provide a message (10–5000 characters).", 400);

	const resendKey = process.env.RESEND_API_KEY;
	const to = process.env.CONTACT_TO_EMAIL;
	const from = process.env.CONTACT_FROM_EMAIL;

	if (!resendKey || !to || !from) {
		return json(
			"Email is not configured on the server. Set RESEND_API_KEY, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL.",
			500,
		);
	}

	try {
		const prettyService = service ? service : "(not specified)";
		const response = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${resendKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				from,
				to,
				subject: `Portfolio ${service ? `(${service}) ` : ""}contact: ${name}`,
				text: `Name: ${name}\nEmail: ${email}\nService: ${prettyService}\n\n${message}\n`,
				reply_to: email,
			}),
		});

		if (!response.ok) {
			return json("Could not send message. Please try again.", 502);
		}
	} catch {
		return json("Could not send message. Please try again.", 502);
	}

	return json("Thanks — your message has been sent.", 200);
}
