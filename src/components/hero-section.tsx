"use client";

import { motion } from "framer-motion";
import { ChevronDown, Github, Linkedin, Mail } from "lucide-react";

export function HeroSection() {
	return (
		<section className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-background via-background to-muted/30">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">
						<span className="block">Desmond</span>
						<span className="block text-primary">McLemore</span>
					</h1>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="mb-8"
				>
					<p className="text-xl sm:text-2xl text-muted-foreground mb-4">
						Full-Stack Software Engineer
					</p>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						4 years of experience building scalable web applications with React,
						Node.js, and modern technologies.
						<span className="text-accent font-medium">
							{" "}
							Founders Award recipient
						</span>{" "}
						at Xometry.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="flex justify-center space-x-6 mb-12"
				>
					<a
						href="https://github.com/dmclemore"
						target="_blank"
						rel="noopener noreferrer"
						className="p-3 rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground transition-colors"
						aria-label="GitHub"
					>
						<Github className="h-6 w-6" />
					</a>
					<a
						href="https://linkedin.com/in/desmond-mclemore"
						target="_blank"
						rel="noopener noreferrer"
						className="p-3 rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground transition-colors"
						aria-label="LinkedIn"
					>
						<Linkedin className="h-6 w-6" />
					</a>
					<a
						href="mailto:desmond@dmclemore.dev"
						className="p-3 rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground transition-colors"
						aria-label="Email"
					>
						<Mail className="h-6 w-6" />
					</a>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.6 }}
				>
					<a
						href="#about"
						className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
					>
						Learn More About Me
						<ChevronDown className="ml-2 h-4 w-4" />
					</a>
				</motion.div>
			</div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1, delay: 1 }}
				className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
			>
				<motion.div
					animate={{ y: [0, 10, 0] }}
					transition={{ duration: 2, repeat: Infinity }}
				>
					<ChevronDown className="h-6 w-6 text-muted-foreground" />
				</motion.div>
			</motion.div>
		</section>
	);
}
