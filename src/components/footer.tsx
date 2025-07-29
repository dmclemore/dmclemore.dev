"use client";

import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-muted/30 border-t border-border">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="mb-6 md:mb-0">
						<h3 className="text-xl font-bold text-foreground mb-2">
							Desmond McLemore
						</h3>
						<p className="text-muted-foreground">
							Full-Stack Software Engineer
						</p>
					</div>

					<div className="flex space-x-6">
						<a
							href="https://github.com/dmclemore"
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-foreground transition-colors"
							aria-label="GitHub"
						>
							<Github className="h-6 w-6" />
						</a>
						<a
							href="https://linkedin.com/in/desmondmclemore"
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-foreground transition-colors"
							aria-label="LinkedIn"
						>
							<Linkedin className="h-6 w-6" />
						</a>
						<a
							href="mailto:desmond@dmclemore.dev"
							className="text-muted-foreground hover:text-foreground transition-colors"
							aria-label="Email"
						>
							<Mail className="h-6 w-6" />
						</a>
					</div>
				</div>

				<div className="mt-8 pt-8 border-t border-border text-center">
					<p className="text-muted-foreground text-sm">
						© {currentYear} Desmond McLemore. Built with Next.js, TypeScript,
						and Tailwind CSS.
					</p>
				</div>
			</div>
		</footer>
	);
}
