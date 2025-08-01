"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Play } from "lucide-react";
import { ReactNode, useState } from "react";
import MazeGenerator from "../projects/maze-generator";
import ProjectModal from "./ProjectModal";
import MazePreview from "./MazePreview";

interface Project {
	id: string;
	title: string;
	description: string;
	type: "embedded" | "external";
	technologies: string[];
	githubUrl?: string;
	liveUrl?: string;
	embedComponent?: ReactNode;
	image?: string;
	previewGif?: ReactNode;
	featured?: boolean;
}

// Placeholder projects - these will be replaced with actual projects
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
		embedComponent: <MazeGenerator />,
		previewGif: <MazePreview />,
	},
	{
		id: "task-manager",
		title: "Task Management System",
		description:
			"Full-stack task management application with real-time collaboration and advanced filtering.",
		type: "external",
		technologies: ["Next.js", "PostgreSQL", "Prisma", "tRPC", "Tailwind CSS"],
		githubUrl: "https://github.com/dmclemore/task-manager",
		liveUrl: "https://tasks.dmclemore.dev",
		image: "/placeholder-project.jpg",
	},
	{
		id: "data-structures",
		title: "Data Structures Playground",
		description:
			"Interactive educational tool for learning data structures with visual representations.",
		type: "embedded",
		technologies: ["React", "TypeScript", "D3.js", "Tailwind CSS"],
		githubUrl: "https://github.com/dmclemore/data-structures",
		embedComponent: (
			<div className="w-full h-64 bg-gradient-to-br from-secondary/30 to-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
				<div className="text-center">
					<Play className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
					<p className="text-muted-foreground">Interactive Demo Coming Soon</p>
				</div>
			</div>
		),
	},
	{
		id: "api-gateway",
		title: "Microservices API Gateway",
		description:
			"Scalable API gateway with authentication, rate limiting, and service discovery.",
		type: "external",
		technologies: ["Node.js", "Express", "Redis", "Docker", "AWS"],
		githubUrl: "https://github.com/dmclemore/api-gateway",
		image: "/placeholder-project.jpg",
	},
	{
		id: "game-engine",
		title: "2D Game Engine",
		description:
			"Lightweight 2D game engine built from scratch with physics and collision detection.",
		type: "embedded",
		technologies: ["TypeScript", "Canvas API", "WebGL", "Physics Engine"],
		githubUrl: "https://github.com/dmclemore/game-engine",
		embedComponent: (
			<div className="w-full h-64 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
				<div className="text-center">
					<Play className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
					<p className="text-muted-foreground">Interactive Demo Coming Soon</p>
				</div>
			</div>
		),
	},
	{
		id: "analytics-dashboard",
		title: "Analytics Dashboard",
		description:
			"Real-time analytics dashboard with customizable widgets and data visualization.",
		type: "external",
		technologies: ["React", "Chart.js", "Node.js", "MongoDB", "WebSocket"],
		githubUrl: "https://github.com/dmclemore/analytics-dashboard",
		liveUrl: "https://analytics.dmclemore.dev",
		image: "/placeholder-project.jpg",
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

function ProjectCard({ 
	project, 
	onOpenModal 
}: { 
	project: Project;
	onOpenModal: (project: Project) => void;
}) {
	const isEmbedded = project.type === "embedded";

	return (
		<motion.div
			variants={itemVariants}
			className={`bg-background rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow ${
				project.featured ? "md:col-span-2" : ""
			}`}
		>
			{/* Project Preview */}
			<div className="aspect-video bg-muted/30 relative overflow-hidden group">
				{isEmbedded && project.previewGif ? (
					<div 
						className="w-full h-full cursor-pointer"
						onClick={() => onOpenModal(project)}
					>
						{project.previewGif}
					</div>
				) : isEmbedded ? (
					<div 
						className="p-4 h-full cursor-pointer"
						onClick={() => onOpenModal(project)}
					>
						<div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
							<div className="text-center">
								<Play className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
								<p className="text-muted-foreground">Click to try interactive demo</p>
							</div>
						</div>
					</div>
				) : (
					<div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
						<div className="text-center">
							<ExternalLink className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
							<p className="text-muted-foreground">External Project</p>
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

					{project.liveUrl && (
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
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);

	const handleOpenModal = (project: Project) => {
		setSelectedProject(project);
	};

	const handleCloseModal = () => {
		setSelectedProject(null);
	};

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
					className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{projects.map(project => (
						<ProjectCard 
							key={project.id} 
							project={project} 
							onOpenModal={handleOpenModal}
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

			{/* Project Modal */}
			<ProjectModal
				isOpen={selectedProject !== null}
				onClose={handleCloseModal}
				title={selectedProject?.title || ""}
			>
				{selectedProject?.embedComponent}
			</ProjectModal>
		</section>
	);
}
