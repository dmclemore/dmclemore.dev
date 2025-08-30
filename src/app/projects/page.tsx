"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
	const router = useRouter();

	useEffect(() => {
		// Redirect to home page and scroll to projects section
		router.replace("/");
		// Small delay to ensure page loads before scrolling
		setTimeout(() => {
			const projectsSection = document.getElementById("projects");
			if (projectsSection) {
				projectsSection.scrollIntoView({ behavior: "smooth" });
			}
		}, 100);
	}, [router]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<p className="text-muted-foreground">Redirecting to projects section...</p>
		</div>
	);
}