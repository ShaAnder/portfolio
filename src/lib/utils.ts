import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/*
  `cn` helper
  -----------
  This is the standard shadcn pattern:
  - `clsx` conditionally joins class strings.
  - `tailwind-merge` resolves conflicting Tailwind utilities (e.g. `p-2` + `p-4`).
	
  Why it matters for this repo:
  - Variant systems (cva) often compose many utilities.
  - `twMerge` prevents accidental class conflicts when you pass `className` overrides.
*/

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
