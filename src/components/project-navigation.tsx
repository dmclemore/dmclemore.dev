"use client";

import { motion } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ProjectNavigation() {
	return (
		<nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Left: Back to Projects */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className="flex-shrink-0"
					>
						<Link
							href="/#projects"
							className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
						>
							<ArrowLeft className="h-4 w-4" />
							<span>Back to Projects</span>
						</Link>
					</motion.div>

					{/* Right: Theme Toggle */}
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<ThemeToggle />
					</motion.div>
				</div>
			</div>
		</nav>
	);
}