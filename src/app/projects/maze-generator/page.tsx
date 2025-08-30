import MazeGenerator from "@/projects/maze-generator";
import { ProjectNavigation } from "@/components/project-navigation";
import { Github } from "lucide-react";

export default function MazeGeneratorPage() {
	return (
		<div className="min-h-screen bg-background">
			<ProjectNavigation />

			{/* Project Header - Always Visible */}
			<section className="pt-16 pb-4 bg-background relative z-10">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						<h1 className="text-2xl sm:text-3xl font-bold text-foreground">
							Maze Generator & Solver
						</h1>
						<a
							href="https://github.com/dmclemore/dmclemore.dev"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center space-x-2 px-4 py-2 bg-secondary hover:bg-accent hover:text-accent-foreground transition-colors rounded-md font-medium"
						>
							<Github className="h-4 w-4" />
							<span>View Code</span>
						</a>
					</div>
				</div>
			</section>

			{/* Maze Generator Component - Full Height */}
			<main className="flex-1 min-h-[calc(100vh-8rem)]">
				<MazeGenerator />
			</main>
		</div>
	);
}
