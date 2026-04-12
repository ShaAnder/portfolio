"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type HeroProfileImageProps = {
	className?: string;
	imageSizes: string;
};

export function HeroProfileImage({
	className,
	imageSizes,
}: HeroProfileImageProps) {
	return (
		<div
			className={cn(
				"relative isolate mx-auto size-40 rounded-full min-[769px]:size-64 lg:size-88 xl:size-112",
				className,
			)}
		>
			<div className="relative z-0 size-full overflow-hidden rounded-full border border-border">
				<Image
					src="/images/profile.jpg"
					alt="Shaun Anderton"
					fill
					priority
					className="object-cover object-[50%_10%] scale-[1.12]"
					sizes={imageSizes}
				/>
			</div>
		</div>
	);
}
