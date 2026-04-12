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

// Improved email template (ported & cleaned from local preview page)
// Returns ONLY the card HTML (perfect for nodemailer). The full document wrapper
// was only needed for the local iframe preview and has been removed here.
function buildEmailHtml(options: {
	name: string;
	email: string;
	service: string;
	subject: string; // kept for API compatibility even though not rendered in body
	message: string;
}) {
	const safeName = escapeHtml(options.name);
	const safeEmail = escapeHtml(options.email);
	const safeService = escapeHtml(options.service);
	const safeMessage = escapeHtml(options.message);

	const card = `
		<div style="
			font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
			background-color: #0b0b0c;
			color: #f5f5f6;
			padding: 28px;
			border-radius: 0;
			width: 100%;
			margin: 0;
			box-sizing: border-box;
			border: 1px solid rgba(255,255,255,0.08);
			box-shadow: 0 14px 34px rgba(0,0,0,0.45);
		">
			<div style="margin: 0 0 20px;">
				<div style="
					font-size: 24px;
					font-weight: 800;
					letter-spacing: -0.02em;
					margin: 0;
					color: #f5f5f6;
				">
					NEW MESSAGE
				</div>
				<div style="padding-top: 1rem; padding-bottom: 0; font-size: 15px; font-weight: 700; color: #e8e8ea; opacity: 0.82;">
					From: ${safeName}
				</div>
				<hr style="border: none; border-top: 1px solid rgba(255,255,255,0.10); margin: 16px 0;" />
			</div>

			<div style="padding-top: 16px;">
				<div style="display:flex;align-items:center;gap:7px;font-size:15px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:rgba(245,245,246,0.62);margin:0 0 6px;">
					<span style="display:inline-flex;align-items:center;">
						<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="color:#e8e8ea;opacity:0.82;vertical-align:middle;" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="3"/><path d="m3 6 8.6 7.13a2 2 0 0 0 2.53 0L23 6"/></svg>
					</span>
					EMAIL
				</div>
				<div style="font-size: 14px; line-height: 1.6; color: rgba(245,245,246,0.92); padding-bottom: 16px;">
					${safeEmail}
				</div>
			</div>

			<div style="padding-top: 16px;">
				<div style="display:flex;align-items:center;gap:7px;font-size:15px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:rgba(245,245,246,0.62);margin:0 0 6px;">
					<span style="display:inline-flex;align-items:center;">
						<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="color:#e8e8ea;opacity:0.82;vertical-align:middle;" viewBox="0 0 24 24"><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M9 8V6a3 3 0 1 1 6 0v2"/></svg>
					</span>
					SERVICE
				</div>
				<div style="font-size: 14px; line-height: 1.6; color: rgba(245,245,246,0.92); padding-bottom: 16px;">
					${safeService}
				</div>
			</div>

			<div style="padding-top: 16px;">
				<div style="display:flex;align-items:center;gap:7px;font-size:15px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:rgba(245,245,246,0.62);margin:0;">
					<span style="display:inline-flex;align-items:center;">
						<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="color:#e8e8ea;opacity:0.82;vertical-align:middle;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg>
					</span>
					MESSAGE
				</div>
				<div style="color: rgba(245,245,246,0.90); font-size: 14px; line-height: 1.2; white-space: pre-line; padding-bottom: 16px; margin-top: 0;">
					${safeMessage}
				</div>
			</div>

			<hr style="border: none; border-top: 1px solid rgba(255,255,255,0.10); margin: 16px 0;" />
			<div style="font-size: 13px; font-weight: 700; color: rgba(245,245,246,0.82);">
				Sent from the portfolio contact form
			</div>
		</div>
	`;

	return card;
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

		// Use the polished template from your local preview page
		const html = buildEmailHtml({
			name,
			email,
			service,
			subject: subjectInput,
			message,
		});

		await transporter.sendMail({
			from: `"${name}" <${from}>`,
			to,
			replyTo: email,
			subject,
			text: `Name: ${name}\nEmail: ${email}\nService: ${service}\nSubject: ${subjectInput}\n\n${message}\n`,
			html,
		});
	} catch {
		return json("Could not send message. Please try again.", 502);
	}

	return json("Thanks. Your message has been sent.", 200);
}
