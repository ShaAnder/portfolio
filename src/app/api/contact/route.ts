export const runtime = "nodejs";

import nodemailer from "nodemailer";

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

function escapeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function toBoolean(value: string | undefined) {
	if (!value) return false;
	return value === "1" || value.toLowerCase() === "true";
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

	try {
		const prettyService = service ? service : "(not specified)";
		const subject = `Portfolio ${service ? `(${service}) ` : ""}contact: ${name}`;

		const smtpHost = process.env.SMTP_HOST;
		const smtpPort = Number.parseInt(process.env.SMTP_PORT ?? "", 10);
		const smtpUser = process.env.SMTP_USER;
		const smtpPass = process.env.SMTP_PASS;
		const smtpSecure = toBoolean(process.env.SMTP_SECURE);
		const gmailUser = process.env.GMAIL_USER;
		const gmailPass = process.env.GMAIL_APP_PASSWORD;

		const to = process.env.CONTACT_TO_EMAIL ?? smtpUser ?? gmailUser;
		const from = process.env.CONTACT_FROM_EMAIL ?? smtpUser ?? gmailUser;

		if (!to || !from) {
			return json(
				"Email is not configured on the server. Set CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL.",
				500,
			);
		}

		const transporter =
			smtpHost && smtpUser && smtpPass
				? nodemailer.createTransport({
						host: smtpHost,
						port: Number.isFinite(smtpPort) && smtpPort > 0 ? smtpPort : 587,
						secure: smtpSecure,
						auth: {
							user: smtpUser,
							pass: smtpPass,
						},
					})
				: gmailUser && gmailPass
					? nodemailer.createTransport({
							service: "gmail",
							auth: {
								user: gmailUser,
								pass: gmailPass,
							},
						})
					: null;

		if (!transporter) {
			return json(
				"Email is not configured on the server. Set either SMTP_HOST/SMTP_USER/SMTP_PASS (and optional SMTP_PORT/SMTP_SECURE) or GMAIL_USER/GMAIL_APP_PASSWORD.",
				500,
			);
		}

		const safeName = escapeHtml(name);
		const safeEmail = escapeHtml(email);
		const safeService = escapeHtml(prettyService);
		const safeMessage = escapeHtml(message);

		const html = `
			<div style="
				font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
				background-color: #141414;
				color: #f0f0f0;
				padding: 32px;
				border-radius: 12px;
				max-width: 680px;
				margin: 24px auto;
				border: 1px solid rgba(255,255,255,0.08);
				box-shadow: 0 8px 22px rgba(0,0,0,0.35);
			">
				<h2 style="
					color: hsl(128, 100%, 67%);
					margin: 0 0 12px;
					font-size: 22px;
					letter-spacing: -0.01em;
				">
					New portfolio message
				</h2>

				<p style="font-size: 14px; line-height: 1.7; margin: 0 0 18px; color: rgba(240,240,240,0.92);">
					<strong style="color:#fff">Name:</strong> ${safeName}<br/>
					<strong style="color:#fff">Email:</strong> ${safeEmail}<br/>
					<strong style="color:#fff">Service:</strong> ${safeService}
				</p>

				<hr style="border: none; border-top: 1px solid rgba(255,255,255,0.10); margin: 22px 0;" />

				<h3 style="font-size: 15px; color: #fff; margin: 0 0 10px;">Message</h3>
				<div style="
					background: rgba(255,255,255,0.06);
					padding: 16px 18px;
					border-radius: 10px;
					border: 1px solid rgba(255,255,255,0.08);
				">
					<div style="
						color: rgba(240,240,240,0.88);
						font-size: 14px;
						line-height: 1.65;
						white-space: pre-line;
					">
						${safeMessage}
					</div>
				</div>

				<p style="margin-top: 22px; font-size: 12px; color: rgba(240,240,240,0.55);">
					Sent from your portfolio contact form.
				</p>
			</div>
		`;

		await transporter.sendMail({
			from: `"${name}" <${from}>`,
			to,
			replyTo: email,
			subject,
			text: `Name: ${name}\nEmail: ${email}\nService: ${prettyService}\n\n${message}\n`,
			html,
		});
	} catch {
		return json("Could not send message. Please try again.", 502);
	}

	return json("Thanks — your message has been sent.", 200);
}
