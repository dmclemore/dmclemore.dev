"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
	const router = useRouter();

	useEffect(() => {
		router.replace("/#projects");
	}, [router]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<p className="text-muted-foreground">Redirecting to projects section...</p>
		</div>
	);
}