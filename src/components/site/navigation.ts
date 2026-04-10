import { FolderKanban, MessageSquare, Quote, User, Wrench } from "lucide-react";

export const navItems = [
	{ label: "About", href: "/#about", icon: User },
	{ label: "Skills", href: "/#skills", icon: Wrench },
	{ label: "Projects", href: "/#projects", icon: FolderKanban },
	{ label: "Testimonials", href: "/#testimonials", icon: Quote },
	{ label: "Contact", href: "/#contact", icon: MessageSquare },
] as const;
