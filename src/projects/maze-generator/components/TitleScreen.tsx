import React from "react";

interface TitleScreenProps {
	onStart: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
	return (
		<div className="flex flex-col items-center justify-center h-full bg-background p-4">
			<div className="text-center p-6 sm:p-8 max-w-4xl mx-auto">
				<div className="bg-muted/20 rounded-lg p-8 mb-10">
					{/* Title - Only visible on start screen */}
					<h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
						Maze Generator & Solver
					</h1>
					
					<p className="text-muted-foreground mb-8 leading-relaxed text-lg sm:text-xl max-w-3xl mx-auto">
						Interactive maze generator using recursive backtracking with manual solving 
						and AI pathfinding algorithms (A* and BFS). Challenge yourself by solving 
						mazes manually or watch the AI find the optimal path.
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
						<div>
							<h3 className="font-bold text-foreground mb-4 text-center text-lg">Features</h3>
							<ul className="space-y-2 text-muted-foreground">
								<li className="flex items-center">
									<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
									Animated maze generation
								</li>
								<li className="flex items-center">
									<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
									Manual solving with timer
								</li>
								<li className="flex items-center">
									<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
									A* and BFS pathfinding
								</li>
								<li className="flex items-center">
									<span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
									Mobile-friendly controls
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-bold text-foreground mb-4 text-center text-lg">Technologies</h3>
							<div className="flex flex-wrap gap-2 justify-center">
								{["React", "TypeScript", "Tailwind CSS", "Algorithms"].map(tech => (
									<span
										key={tech}
										className="px-3 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium"
									>
										{tech}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>

				<button
					onClick={onStart}
					className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-12 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-xl hover:scale-105 transform"
				>
					Start Game
				</button>
			</div>
		</div>
	);
};

export default TitleScreen;
