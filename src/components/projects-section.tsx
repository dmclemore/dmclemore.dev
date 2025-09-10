"use client";

import { motion } from "framer-motion";
import { Github, Play } from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";
import MazePreview from "./MazePreview";
import SudokuPreview from "./SudokuPreview";
import QueueStackPreview from "./QueueStackPreview";
import DataGenerationPreview from "./DataGenerationPreview";
import PreviewOverlay from "./PreviewOverlay";

interface Project {
	id: string;
	title: string;
	description: string;
	technologies: string[];
	githubUrl?: string;
	previewGif?: ReactNode;
	featured?: boolean;
	overlayText?: string;
}

const projects: Project[] = [
	{
		id: "data-generation-app",
		title: "AI-Powered Synthetic Data Generator",
		description:
			"Production-ready Python CLI tool that generates realistic datasets up to 50K records using OpenAI. Features intelligent duplicate detection, batch processing, and industry-specific contexts with advanced similarity algorithms.",
		technologies: ["Python", "OpenAI API", "Pandas", "CLI", "Data Processing"],
		githubUrl: "https://github.com/dmclemore/data-generation-app",
		featured: true,
		previewGif: <DataGenerationPreview />,
		overlayText: "View Sample Data",
	},
	{
		id: "queue-stack",
		title: "Queue & Stack Visualizer",
		description:
			"Interactive data structure visualizer featuring animated queue (FIFO) and stack (LIFO) operations with educational content and real-world examples.",
		technologies: ["React", "TypeScript", "Tailwind CSS", "Data Structures"],
		githubUrl:
			"https://github.com/dmclemore/dmclemore.dev/tree/main/src/projects/queue-stack",
		featured: false,
		previewGif: <QueueStackPreview />,
	},
	{
		id: "maze-generator",
		title: "Maze Generator & Solver",
		description:
			"Interactive maze generator using recursive backtracking with manual solving and AI pathfinding algorithms (A* and BFS).",
		technologies: ["React", "TypeScript", "Tailwind CSS", "Algorithms"],
		githubUrl:
			"https://github.com/dmclemore/dmclemore.dev/tree/main/src/projects/maze-generator",
		featured: false,
		previewGif: <MazePreview />,
	},
	{
		id: "sudoku-generator",
		title: "Sudoku Generator & Solver",
		description:
			"Advanced Sudoku puzzle generator with manual solving featuring pencil marks, hints, and AI solving algorithms (logical elimination and backtracking).",
		technologies: ["React", "TypeScript", "Tailwind CSS", "Algorithms"],
		githubUrl:
			"https://github.com/dmclemore/dmclemore.dev/tree/main/src/projects/sudoku-generator",
		featured: true,
		previewGif: <SudokuPreview />,
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
	return (
		<motion.div
			variants={itemVariants}
			className={`bg-background rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow ${
				project.featured ? "md:col-span-2" : ""
			}`}
		>
			{/* Project Preview */}
			<Link href={`/projects/${project.id}`} className="block">
				<div className="aspect-video bg-muted/30 relative overflow-hidden group hover:bg-muted/40 transition-colors">
					{project.previewGif ? (
						<>
							<div className="w-full h-full">{project.previewGif}</div>
							<PreviewOverlay text={project.overlayText} />
						</>
					) : (
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
					)}
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

					<Link
						href={`/projects/${project.id}`}
						className="flex items-center space-x-2 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-md text-sm font-medium"
					>
						<Play className="h-4 w-4" />
						<span>
							{project.id === "data-generation-app"
								? "View Sample"
								: "Try Demo"}
						</span>
					</Link>
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
					className={`grid gap-6 ${
						projects.length === 1
							? "justify-center"
							: "md:grid-cols-2 lg:grid-cols-3"
					}`}
				>
					{projects.map(project => (
						<ProjectCard key={project.id} project={project} />
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
