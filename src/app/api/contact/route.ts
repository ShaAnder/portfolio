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
	const MIN_MESSAGE_CHARS = 50;

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
	const rawSubject = payload.subject;
	const rawMessage = payload.message;

	const firstName = typeof rawFirstName === "string" ? rawFirstName.trim() : "";
	const lastName = typeof rawLastName === "string" ? rawLastName.trim() : "";
	const legacyName = typeof rawName === "string" ? rawName.trim() : "";
	const email = typeof rawEmail === "string" ? rawEmail.trim() : "";
	const service = typeof rawService === "string" ? rawService.trim() : "";
	const subjectInput = typeof rawSubject === "string" ? rawSubject.trim() : "";
	const message = typeof rawMessage === "string" ? rawMessage.trim() : "";

	const name =
		firstName || lastName ? `${firstName} ${lastName}`.trim() : legacyName;

	if (name.length < 2 || name.length > 120)
		return json("Please provide a valid name.", 400);
	if (firstName.length > 60 || lastName.length > 60)
		return json("Please provide a valid name.", 400);
	if (!isValidEmail(email) || email.length > 254)
		return json("Please provide a valid email.", 400);
	if (!service) return json("Please select a service.", 400);
	if (service.length > 100) return json("Please choose a valid service.", 400);
	if (subjectInput.length < 2 || subjectInput.length > 160)
		return json("Please provide a subject.", 400);
	if (message.length < MIN_MESSAGE_CHARS || message.length > 5000)
		return json(
			`Please provide a message (${MIN_MESSAGE_CHARS}–5000 characters).`,
			400,
		);

	try {
		const prettyService = service;
		const subject = `Portfolio (${service}) ${subjectInput}: ${name}`;

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
		const safeSubject = escapeHtml(subject);
		const safeMessage = escapeHtml(message);

		const html = `
			<div style="
				font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
				background-color: #0b0b0c;
				color: #f5f5f6;
				padding: 28px;
				border-radius: 14px;
				max-width: 680px;
				margin: 24px auto;
				border: 1px solid rgba(255,255,255,0.08);
				box-shadow: 0 14px 34px rgba(0,0,0,0.45);
			">
				<div style="margin: 0 0 14px;">
					<div style="
						font-size: 18px;
						font-weight: 800;
						letter-spacing: -0.02em;
						margin: 0;
						color: #f5f5f6;
					">
						NEW MESSAGE
					</div>
					<div style="
						margin-top: 6px;
						font-size: 12px;
						line-height: 1.6;
						color: rgba(245,245,246,0.62);
					">
						Sent from portfolio contact form
					</div>
				</div>

				<div style="margin: 0 0 14px;">
					<div style="
						font-size: 11px;
						font-weight: 900;
						letter-spacing: 0.12em;
						text-transform: uppercase;
						color: rgba(245,245,246,0.62);
						margin: 0 0 6px;
					">
						EMAIL
					</div>
					<div style="font-size: 14px; line-height: 1.6; color: rgba(245,245,246,0.92);">
						${safeEmail}
					</div>
				</div>

				<div style="margin: 0 0 14px;">
					<div style="
						font-size: 11px;
						font-weight: 900;
						letter-spacing: 0.12em;
						text-transform: uppercase;
						color: rgba(245,245,246,0.62);
						margin: 0 0 6px;
					">
						SERVICE
					</div>
					<div style="font-size: 14px; line-height: 1.6; color: rgba(245,245,246,0.92);">
						${safeService}
					</div>
				</div>

				<div style="margin: 0 0 18px;">
					<div style="
						font-size: 11px;
						font-weight: 900;
						letter-spacing: 0.12em;
						text-transform: uppercase;
						color: rgba(245,245,246,0.62);
						margin: 0 0 6px;
					">
						SUBJECT
					</div>
					<div style="font-size: 14px; line-height: 1.6; color: rgba(245,245,246,0.92);">
						${safeSubject}
					</div>
				</div>

				<hr style="border: none; border-top: 1px solid rgba(255,255,255,0.10); margin: 22px 0;" />

				<div style="margin: 0;">
					<div style="
						font-size: 11px;
						font-weight: 900;
						letter-spacing: 0.12em;
						text-transform: uppercase;
						color: rgba(245,245,246,0.62);
						margin: 0 0 10px;
					">
						MESSAGE
					</div>
					<div style="
						background: rgba(255,255,255,0.05);
						padding: 16px 18px;
						border-radius: 12px;
					">
						<div style="
							color: rgba(245,245,246,0.90);
							font-size: 14px;
							line-height: 1.7;
							white-space: pre-line;
						">
							${safeMessage}
						</div>
					</div>
				</div>

				<div style="margin-top: 22px; font-size: 12px; color: rgba(245,245,246,0.55);">
					Sent from portfolio contact form
				</div>
				<div style="display:none;">${safeName}</div>
			</div>
		`;

		await transporter.sendMail({
			from: `"${name}" <${from}>`,
			to,
			replyTo: email,
			subject,
			text: `Name: ${name}\nEmail: ${email}\nService: ${prettyService}\nSubject: ${subjectInput}\n\n${message}\n`,
			html,
		});
	} catch {
		return json("Could not send message. Please try again.", 502);
	}

	return json("Thanks. Your message has been sent.", 200);
}
