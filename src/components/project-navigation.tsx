"use client";

import { motion } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { ArrowLeft, Github } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ProjectNavigationProps {
	projectTitle?: string;
	githubUrl?: string;
	onStartOver?: () => void;
	showStartOver?: boolean;
	showTitle?: boolean;
	switchButtonText?: string;
	onSwitchClick?: () => void;
	showSwitchButton?: boolean;
}

export function ProjectNavigation({
	projectTitle,
	githubUrl,
	onStartOver,
	showStartOver = false,
	showTitle = true,
	switchButtonText,
	onSwitchClick,
	showSwitchButton = false,
}: ProjectNavigationProps) {
	const [isLargeScreen, setIsLargeScreen] = useState(false);

	useEffect(() => {
		const checkScreenSize = () => {
			setIsLargeScreen(window.innerWidth >= 640); // sm breakpoint
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);
		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	const scrollToProjects = () => {
		window.location.href = '/projects';
	};

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
						<button
							onClick={scrollToProjects}
							className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
						>
							<ArrowLeft className="h-4 w-4" />
							<span>Back to Projects</span>
						</button>
					</motion.div>

					{/* Center: Project Title */}
					{projectTitle && showTitle && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="absolute left-1/2 transform -translate-x-1/2 hidden md:block"
						>
							<h1 className="text-lg font-semibold text-foreground">
								{projectTitle}
							</h1>
						</motion.div>
					)}

					{/* Right: Buttons + Theme Toggle */}
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="flex items-center space-x-3"
					>
						{/* Switch Button - Project specific */}
						{showSwitchButton && onSwitchClick && switchButtonText && (
							<button
								onClick={onSwitchClick}
								className="hidden md:block px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors rounded text-sm font-medium"
							>
								{switchButtonText}
							</button>
						)}

						{/* Start Over Button - Hidden on mobile */}
						{showStartOver && onStartOver && (
							<button
								onClick={onStartOver}
								className="hidden md:block px-3 py-1.5 bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded text-sm font-medium"
							>
								Start Over
							</button>
						)}

						{/* GitHub Link */}
						{githubUrl && (
							<a
								href={githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center space-x-1.5 px-3 py-1.5 bg-secondary hover:bg-accent hover:text-accent-foreground transition-colors rounded text-sm font-medium"
							>
								<Github className="h-4 w-4" />
								{isLargeScreen && <span>Code</span>}
							</a>
						)}

						<ThemeToggle />
					</motion.div>
				</div>
			</div>

			{/* Mobile Start Over and Switch Buttons - Below nav */}
			{(showStartOver || showSwitchButton) && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="md:hidden bg-background/80 backdrop-blur-sm border-b border-border"
				>
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="py-3 space-y-2">
							{showSwitchButton && onSwitchClick && switchButtonText && (
								<button
									onClick={onSwitchClick}
									className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors rounded text-sm font-medium"
								>
									{switchButtonText}
								</button>
							)}
							{showStartOver && onStartOver && (
								<button
									onClick={onStartOver}
									className="w-full px-4 py-2 bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded text-sm font-medium"
								>
									Start Over
								</button>
							)}
						</div>
					</div>
				</motion.div>
			)}
		</nav>
	);
}
