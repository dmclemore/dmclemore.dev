"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
	const router = useRouter();

	useEffect(() => {
		// Redirect to home page and scroll to projects section
		router.replace("/");
		
		// Wait for the element to be available with retry logic
		const scrollToProjects = () => {
			const projectsSection = document.getElementById("projects");
			if (projectsSection) {
				projectsSection.scrollIntoView({ behavior: "smooth" });
			} else {
				// Retry after a short delay if element not found
				setTimeout(scrollToProjects, 50);
			}
		};
		
		// Start checking after initial delay
		setTimeout(scrollToProjects, 200);
	}, [router]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<p className="text-muted-foreground">Redirecting to projects section...</p>
		</div>
	);
}