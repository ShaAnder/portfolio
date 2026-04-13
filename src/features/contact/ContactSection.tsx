"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FOCUS_RING, HOVER_LIFT_RING } from "@/lib/uiClasses";
import { contactDetails } from "@/data/contact";

type ContactFormState =
	| { status: "idle"; message?: string }
	| { status: "sending"; message?: string }
	| { status: "success"; message: string }
	| { status: "error"; message: string };

function isValidEmail(email: string) {
	const value = email.trim();
	if (!value) return false;
	// Practical, not perfect, validation.
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ContactSection({ className }: { className?: string }) {
	const MIN_MESSAGE_CHARS = 50;

	const [name, setName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [service, setService] = React.useState("");
	const [subject, setSubject] = React.useState("");
	const [message, setMessage] = React.useState("");
	const [state, setState] = React.useState<ContactFormState>({
		status: "idle",
	});

	const trimmedMessageLength = message.trim().length;
	const remainingMessageChars = Math.max(
		0,
		MIN_MESSAGE_CHARS - trimmedMessageLength,
	);

	const canSubmit =
		state.status !== "sending" &&
		name.trim().length >= 2 &&
		service.trim().length > 0 &&
		subject.trim().length >= 2 &&
		isValidEmail(email) &&
		trimmedMessageLength >= MIN_MESSAGE_CHARS;

	const fieldBaseClassName =
		"w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
	const inputClassName = cn(fieldBaseClassName, FOCUS_RING);
	const textareaClassName = cn(fieldBaseClassName, "resize-none", FOCUS_RING);
	const submitButtonClassName = cn(
		"rounded-full",
		"h-10 px-4 text-base",
		HOVER_LIFT_RING,
	);

	async function onSubmit(event: React.FormEvent) {
		event.preventDefault();

		const trimmedName = name.trim();
		const trimmedEmail = email.trim();
		const trimmedService = service.trim();
		const trimmedSubject = subject.trim();
		const trimmedMessage = message.trim();

		if (trimmedName.length < 2) {
			setState({ status: "error", message: "Please enter your name." });
			return;
		}
		if (!isValidEmail(trimmedEmail)) {
			setState({ status: "error", message: "Please enter a valid email." });
			return;
		}
		if (!trimmedService) {
			setState({ status: "error", message: "Please select a service." });
			return;
		}
		if (trimmedSubject.length < 2) {
			setState({ status: "error", message: "Please enter a subject." });
			return;
		}
		if (trimmedMessage.length < MIN_MESSAGE_CHARS) {
			setState({
				status: "error",
				message: `Please enter a message (${MIN_MESSAGE_CHARS} characters minimum).`,
			});
			return;
		}

		setState({ status: "sending" });

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: trimmedName,
					email: trimmedEmail,
					service: trimmedService,
					subject: trimmedSubject,
					message: trimmedMessage,
				}),
			});

			const data = (await res.json().catch(() => null)) as {
				ok?: boolean;
				message?: string;
			} | null;

			if (!res.ok) {
				setState({
					status: "error",
					message: data?.message || "Something went wrong. Please try again.",
				});
				return;
			}

			setState({
				status: "success",
				message: data?.message || "Message sent successfully.",
			});
			setName("");
			setEmail("");
			setService("");
			setSubject("");
			setMessage("");
		} catch {
			setState({
				status: "error",
				message: "Could not send message. Please try again.",
			});
		}
	}

	return (
		<div
			className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8", className)}
		>
			<div className="mx-auto mb-4 max-w-4xl text-center sm:mb-7">
				<p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
					I’m always open to connecting about{" "}
					<span className="font-medium text-foreground/80">
						exciting opportunities, creative collaborations, or freelance
						projects
					</span>
					. Whether you’re looking to bring a digital concept to life, improve
					an existing product, or explore something new, I’d love to hear from
					you.
				</p>
				<p className="mt-2 hidden text-pretty text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:block sm:text-base md:text-lg">
					Share a few details about your project below, and I’ll get back to you
					as soon as possible.
				</p>
			</div>
			<div className="flex flex-col items-center justify-center gap-4 sm:gap-6 xl:flex-row xl:items-start xl:gap-10">
				<div className="hidden w-full flex-1 flex-col max-w-4xl xl:flex xl:max-w-3xl 2xl:max-w-130">
					<Card className="bg-transparent ring-0">
						<CardContent className="flex flex-col py-2">
							<div className="space-y-10">
								<div className="grid grid-cols-[auto_1fr] items-center gap-6">
									<div className="flex size-14 items-center justify-center rounded-md border border-border bg-black/10">
										<Phone
											className="size-6 text-foreground/80"
											aria-hidden="true"
										/>
									</div>
									<div className="flex flex-col justify-center gap-1 leading-tight">
										<div className="text-lg font-medium text-foreground/80">
											Phone
										</div>
										<a
											className="wrap-break-word text-xl text-muted-foreground underline-offset-4 hover:underline"
											href={`tel:${contactDetails.phone.replace(/\s+/g, "")}`}
										>
											{contactDetails.phone}
										</a>
									</div>
								</div>

								<div className="grid grid-cols-[auto_1fr] items-center gap-6">
									<div className="flex size-14 items-center justify-center rounded-md border border-border bg-black/10">
										<MapPin
											className="size-6 text-foreground/80"
											aria-hidden="true"
										/>
									</div>
									<div className="flex flex-col justify-center gap-1 leading-tight">
										<div className="text-lg font-medium text-foreground/80">
											Location
										</div>
										<div className="wrap-break-word text-xl text-muted-foreground">
											{contactDetails.location}
										</div>
									</div>
								</div>

								<div className="grid grid-cols-[auto_1fr] items-center gap-6">
									<div className="flex size-14 items-center justify-center rounded-md border border-border bg-black/10">
										<Mail
											className="size-6 text-foreground/80"
											aria-hidden="true"
										/>
									</div>
									<div className="flex flex-col justify-center gap-1 leading-tight">
										<div className="text-lg font-medium text-foreground/80">
											Email
										</div>
										<a
											className="wrap-break-word text-xl text-muted-foreground underline-offset-4 hover:underline"
											href={`mailto:${contactDetails.email}`}
										>
											{contactDetails.email}
										</a>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="flex w-full flex-1 xl:w-[58%] max-w-full md:max-w-3xl xl:max-w-3xl 2xl:max-w-4xl">
					<Card className="bg-black/10 ring-0 w-full">
						<CardContent className="py-2">
							<form onSubmit={onSubmit} className="space-y-2 sm:space-y-3">
								<div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
									<div className="space-y-1">
										<label className="sr-only" htmlFor="contact-name">
											Name
										</label>
										<input
											id="contact-name"
											name="name"
											autoComplete="name"
											required
											placeholder="Name"
											value={name}
											onChange={(e) => setName(e.target.value)}
											className={inputClassName}
										/>
									</div>
									<div className="space-y-1">
										<label className="sr-only" htmlFor="contact-email">
											Email
										</label>
										<input
											id="contact-email"
											name="email"
											autoComplete="email"
											required
											type="email"
											placeholder="Email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className={inputClassName}
										/>
									</div>
								</div>

								<div className="grid gap-2 sm:gap-3">
									<div className="space-y-1">
										<label className="sr-only" htmlFor="contact-subject">
											Subject
										</label>
										<input
											id="contact-subject"
											name="subject"
											required
											placeholder="Subject"
											value={subject}
											onChange={(e) => setSubject(e.target.value)}
											className={inputClassName}
										/>
									</div>
									<div className="space-y-1">
										<label className="sr-only" htmlFor="contact-service">
											Service
										</label>
										<select
											id="contact-service"
											name="service"
											required
											value={service}
											onChange={(e) => setService(e.target.value)}
											className={inputClassName}
										>
											<option value="" disabled>
												Service
											</option>
											<option value="Portfolio / brochure site">
												Portfolio / brochure site
											</option>
											<option value="Full-stack web app">
												Full-stack web app
											</option>
											<option value="API / backend">API / backend</option>
											<option value="UI / frontend polish">
												UI / frontend polish
											</option>
											<option value="Other">Other</option>
										</select>
									</div>
								</div>

								<div className="space-y-1">
									<label className="sr-only" htmlFor="contact-message">
										Message
									</label>
									<textarea
										id="contact-message"
										name="message"
										required
										rows={4}
										placeholder="Message"
										value={message}
										onChange={(e) => setMessage(e.target.value)}
										className={textareaClassName}
									/>
								</div>

								<div className="flex items-center gap-3">
									<Button
										type="submit"
										disabled={!canSubmit}
										variant="outline"
										size="lg"
										data-icon="inline-end"
										className={submitButtonClassName}
									>
										{state.status === "sending" ? "Sending…" : "Send message"}
										<ArrowUpRight className="size-4" aria-hidden="true" />
									</Button>

									<div className="flex-1 text-right text-xs text-muted-foreground">
										{state.status === "error" ? (
											<span className="text-destructive">{state.message}</span>
										) : state.status === "success" ? (
											<span className="text-foreground/80">
												{state.message}
											</span>
										) : remainingMessageChars > 0 ? (
											<span className="text-destructive">
												<AnimatePresence mode="popLayout" initial={false}>
													<motion.span
														key={remainingMessageChars}
														initial={{ opacity: 0, y: -4 }}
														animate={{ opacity: 1, y: 0 }}
														exit={{ opacity: 0, y: 4 }}
														transition={{ duration: 0.18 }}
														className="inline-block tabular-nums"
													>
														{remainingMessageChars}
													</motion.span>
												</AnimatePresence>{" "}
												characters required
											</span>
										) : (
											""
										)}
									</div>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
