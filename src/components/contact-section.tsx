"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, FileText, Calendar } from "lucide-react";

const contactMethods = [
	{
		icon: Mail,
		label: "Email",
		value: "desmond@dmclemore.dev",
		href: "mailto:desmond@dmclemore.dev",
		description: "Best for professional inquiries",
	},
	{
		icon: Linkedin,
		label: "LinkedIn",
		value: "in/desmondmclemore",
		href: "https://linkedin.com/in/desmondmclemore",
		description: "Let's connect professionally",
	},
	{
		icon: Github,
		label: "GitHub",
		value: "dmclemore",
		href: "https://github.com/dmclemore",
		description: "Check out my personal projects",
	},
	{
		icon: FileText,
		label: "Resume",
		value: "View & Download",
		href: "/resume",
		description: "Work history and skills",
	},
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5 },
	},
};

export function ContactSection() {
	return (
		<section id="contact" className="py-20 bg-background">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
						Let's Work Together
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						I'm always interested in new opportunities and exciting projects.
						Feel free to reach out if you'd like to discuss potential
						collaboration.
					</p>
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid md:grid-cols-2 gap-6 mb-12"
				>
					{contactMethods.map(method => {
						const IconComponent = method.icon;
						const content = (
							<motion.div
								variants={itemVariants}
								className="bg-muted/30 rounded-lg p-6 border border-border hover:shadow-md transition-shadow"
							>
								<div className="flex items-start space-x-4">
									<div className="flex-shrink-0">
										<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
											<IconComponent className="h-6 w-6 text-primary" />
										</div>
									</div>

									<div className="flex-1 min-w-0">
										<h3 className="text-lg font-semibold text-foreground mb-1">
											{method.label}
										</h3>
										<p className="text-primary font-medium mb-2">
											{method.value}
										</p>
										<p className="text-sm text-muted-foreground">
											{method.description}
										</p>
									</div>
								</div>
							</motion.div>
						);

						return method.href ? (
							<a
								key={method.label}
								href={method.href}
								target={method.href.startsWith("http") ? "_blank" : undefined}
								rel={
									method.href.startsWith("http")
										? "noopener noreferrer"
										: undefined
								}
								className="block hover:scale-105 transition-transform"
							>
								{content}
							</a>
						) : (
							<div key={method.label}>{content}</div>
						);
					})}
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					viewport={{ once: true }}
					className="text-center bg-muted/30 rounded-lg p-8 border border-border"
				>
					<Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
					<h3 className="text-xl font-semibold text-foreground mb-2">
						Schedule a Meeting
					</h3>
					<p className="text-muted-foreground mb-6">
						Prefer a more structured conversation? Let's schedule a call to
						discuss your project in detail.
					</p>
					<a
						href="mailto:desmond@dmclemore.dev?subject=Meeting Request&body=Hi Desmond,%0A%0AI'd like to schedule a meeting to discuss..."
						className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg font-medium"
					>
						<Mail className="h-5 w-5" />
						<span>Request Meeting</span>
					</a>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.6 }}
					viewport={{ once: true }}
					className="text-center mt-12"
				>
					<p className="text-muted-foreground">
						Currently open to new full-time opportunities
					</p>
				</motion.div>
			</div>
		</section>
	);
}
