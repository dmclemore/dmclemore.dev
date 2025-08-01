import React from "react";

interface TitleScreenProps {
	onStart: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
	return (
		<div className="flex flex-col items-center justify-center h-full bg-background p-4">
			<div className="text-center p-6 sm:p-8 bg-muted/30 rounded-lg shadow-lg max-w-md mx-auto border border-border">
				<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
					Maze Generator
				</h1>
				<h2 className="text-lg sm:text-xl text-muted-foreground mb-6">& Solver</h2>

				<p className="text-muted-foreground mb-6 leading-relaxed text-sm sm:text-base">
					Generate mazes using recursive backtracking and solve them manually or
					watch AI algorithms find the optimal path.
				</p>

				<button
					onClick={onStart}
					className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
				>
					Start Game
				</button>

				<div className="mt-6 text-sm text-muted-foreground">
					<p>Features:</p>
					<ul className="mt-2 space-y-1 text-xs sm:text-sm">
						<li>• Animated maze generation</li>
						<li>• Manual solving with timer</li>
						<li>• A* and BFS algorithms</li>
						<li>• Mobile-friendly controls</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default TitleScreen;
