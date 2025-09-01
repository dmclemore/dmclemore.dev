"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Menu, X } from "lucide-react";

const navigation = [
	{ name: "About", id: "about" },
	{ name: "Skills", id: "skills" },
	{ name: "Projects", id: "projects" },
	{ name: "Contact", id: "contact" },
	{ name: "Resume", id: "resume", isExternal: true },
];

export function Navigation() {
	const [isOpen, setIsOpen] = useState(false);

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className="flex-shrink-0"
					>
						<button onClick={scrollToTop} className="text-xl font-bold text-foreground cursor-pointer">
							DM
						</button>
					</motion.div>

					{/* Desktop navigation */}
					<div className="hidden md:flex items-center space-x-8">
						{navigation.map((item, index) => (
							item.isExternal ? (
								<motion.a
									key={item.name}
									href={`/${item.id}`}
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
									className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
								>
									{item.name}
								</motion.a>
							) : (
								<motion.button
									key={item.name}
									onClick={() => scrollToSection(item.id)}
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
									className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
								>
									{item.name}
								</motion.button>
							)
						))}
						<ThemeToggle />
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden flex items-center space-x-2">
						<ThemeToggle />
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
						>
							{isOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile navigation */}
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="md:hidden py-4 border-t border-border"
					>
						{navigation.map(item => (
							item.isExternal ? (
								<a
									key={item.name}
									href={`/${item.id}`}
									onClick={() => setIsOpen(false)}
									className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors text-left w-full cursor-pointer"
								>
									{item.name}
								</a>
							) : (
								<button
									key={item.name}
									onClick={() => {
										scrollToSection(item.id);
										setIsOpen(false);
									}}
									className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors text-left w-full cursor-pointer"
								>
									{item.name}
								</button>
							)
						))}
					</motion.div>
				)}
			</div>
		</nav>
	);
}
