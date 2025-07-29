"use client";

import { motion } from "framer-motion";

const skillCategories = [
	{
		title: "Frontend",
		skills: [
			{ name: "TypeScript", level: 90 },
			{ name: "React", level: 95 },
			{ name: "Next.js", level: 85 },
			{ name: "Tailwind CSS", level: 90 },
			{ name: "Framer Motion", level: 80 },
		],
	},
	{
		title: "Backend",
		skills: [
			{ name: "Node.js", level: 90 },
			{ name: "Express.js", level: 85 },
			{ name: "PostgreSQL", level: 80 },
			{ name: "Redis", level: 75 },
			{ name: "GraphQL", level: 70 },
		],
	},
	{
		title: "Cloud & DevOps",
		skills: [
			{ name: "AWS", level: 80 },
			{ name: "Docker", level: 75 },
			{ name: "CI/CD", level: 80 },
			{ name: "Git", level: 95 },
			{ name: "Linux", level: 75 },
		],
	},
	{
		title: "Tools & Other",
		skills: [
			{ name: "Claude Code", level: 70 },
			{ name: "Jest", level: 85 },
			{ name: "Cursor", level: 95 },
			{ name: "Figma", level: 75 },
			{ name: "Postman", level: 90 },
		],
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

export function SkillsSection() {
	return (
		<section id="skills" className="py-20 bg-background">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
						Technical Skills
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						A comprehensive toolkit built through 4 years of professional
						development experience
					</p>
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
				>
					{skillCategories.map((category, categoryIndex) => (
						<motion.div
							key={category.title}
							variants={itemVariants}
							className="bg-muted/30 rounded-lg p-6 border border-border"
						>
							<h3 className="text-xl font-semibold text-foreground mb-6">
								{category.title}
							</h3>

							<div className="space-y-4">
								{category.skills.map((skill, skillIndex) => (
									<div key={skill.name}>
										<div className="flex justify-between items-center mb-2">
											<span className="text-sm font-medium text-foreground">
												{skill.name}
											</span>
											<span className="text-xs text-muted-foreground">
												{skill.level}%
											</span>
										</div>

										<div className="w-full bg-secondary rounded-full h-2">
											<motion.div
												className="bg-primary h-2 rounded-full"
												initial={{ width: 0 }}
												whileInView={{ width: `${skill.level}%` }}
												transition={{
													duration: 1,
													delay: categoryIndex * 0.2 + skillIndex * 0.1,
													ease: "easeOut",
												}}
												viewport={{ once: true }}
											/>
										</div>
									</div>
								))}
							</div>
						</motion.div>
					))}
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.5 }}
					viewport={{ once: true }}
					className="mt-12 text-center"
				>
					<p className="text-muted-foreground">
						Always learning and exploring new technologies to stay current with
						industry trends
					</p>
				</motion.div>
			</div>
		</section>
	);
}
