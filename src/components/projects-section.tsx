"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Play } from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";
import MazePreview from "./MazePreview";

interface Project {
	id: string;
	title: string;
	description: string;
	type: "embedded" | "external";
	technologies: string[];
	githubUrl?: string;
	liveUrl?: string;
	image?: string;
	previewGif?: ReactNode;
	featured?: boolean;
}

const projects: Project[] = [
	{
		id: "maze-generator",
		title: "Maze Generator & Solver",
		description:
			"Interactive maze generator using recursive backtracking with manual solving and AI pathfinding algorithms (A* and BFS).",
		type: "embedded",
		technologies: ["React", "TypeScript", "Tailwind CSS", "Algorithms"],
		githubUrl: "https://github.com/dmclemore/dmclemore.dev",
		featured: true,
		previewGif: <MazePreview />,
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

function ProjectCard({ project }: { project: Project }) {
	const isEmbedded = project.type === "embedded";

	return (
		<motion.div
			variants={itemVariants}
			className={`bg-background rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow ${
				project.featured ? "md:col-span-2" : ""
			}`}
		>
			{/* Project Preview */}
			<Link href={isEmbedded ? `/projects/${project.id}` : project.liveUrl || '#'} className="block">
				<div className="aspect-video bg-muted/30 relative overflow-hidden group hover:bg-muted/40 transition-colors">
					{isEmbedded && project.previewGif ? (
						<div className="w-full h-full">
							{project.previewGif}
						</div>
					) : isEmbedded ? (
						<div className="p-4 h-full">
							<div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center border-2 border-dashed border-border group-hover:border-primary/40 transition-colors">
								<div className="text-center">
									<Play className="h-12 w-12 text-muted-foreground group-hover:text-primary mx-auto mb-2 transition-colors" />
									<p className="text-muted-foreground group-hover:text-foreground transition-colors">
										Click to try interactive demo
									</p>
								</div>
							</div>
						</div>
					) : (
						<div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
							<div className="text-center">
								<ExternalLink className="h-12 w-12 text-muted-foreground group-hover:text-primary mx-auto mb-2 transition-colors" />
								<p className="text-muted-foreground group-hover:text-foreground transition-colors">External Project</p>
							</div>
						</div>
					)}

					{/* Project Type Badge */}
					<div className="absolute top-4 right-4">
						<span
							className={`px-3 py-1 rounded-full text-xs font-medium ${
								isEmbedded
									? "bg-primary/10 text-primary border border-primary/20"
									: "bg-accent/10 text-accent border border-accent/20"
							}`}
						>
							{isEmbedded ? "Try it now" : "View project"}
						</span>
					</div>
				</div>
			</Link>

			{/* Project Info */}
			<div className="p-6">
				<h3 className="text-xl font-semibold text-foreground mb-2">
					{project.title}
				</h3>

				<p className="text-muted-foreground mb-4 leading-relaxed">
					{project.description}
				</p>

				{/* Technologies */}
				<div className="flex flex-wrap gap-2 mb-4">
					{project.technologies.map(tech => (
						<span
							key={tech}
							className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium"
						>
							{tech}
						</span>
					))}
				</div>

				{/* Action Buttons */}
				<div className="flex space-x-3">
					{project.githubUrl && (
						<a
							href={project.githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center space-x-2 px-3 py-2 bg-secondary hover:bg-accent hover:text-accent-foreground transition-colors rounded-md text-sm font-medium"
						>
							<Github className="h-4 w-4" />
							<span>Code</span>
						</a>
					)}

					{isEmbedded ? (
						<Link
							href={`/projects/${project.id}`}
							className="flex items-center space-x-2 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md text-sm font-medium"
						>
							<Play className="h-4 w-4" />
							<span>Try Demo</span>
						</Link>
					) : project.liveUrl && (
						<a
							href={project.liveUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center space-x-2 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md text-sm font-medium"
						>
							<ExternalLink className="h-4 w-4" />
							<span>Live Demo</span>
						</a>
					)}
				</div>
			</div>
		</motion.div>
	);
}

export function ProjectsSection() {
	return (
		<section id="projects" className="py-20 bg-muted/30">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
						Featured Projects
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						A showcase of my work ranging from interactive web applications to
						scalable backend systems
					</p>
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className={`grid gap-6 ${projects.length === 1 ? 'justify-center' : 'md:grid-cols-2 lg:grid-cols-3'}`}
				>
					{projects.map(project => (
						<ProjectCard 
							key={project.id} 
							project={project} 
						/>
					))}
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.5 }}
					viewport={{ once: true }}
					className="mt-12 text-center"
				>
					<p className="text-muted-foreground mb-4">
						More projects coming soon! This portfolio is designed to grow as I
						take on new challenges.
					</p>
					<a
						href="https://github.com/dmclemore"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center space-x-2 px-6 py-3 bg-secondary hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg font-medium"
					>
						<Github className="h-5 w-5" />
						<span>View All on GitHub</span>
					</a>
				</motion.div>
			</div>
		</section>
	);
}