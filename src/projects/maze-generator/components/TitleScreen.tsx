import React from "react";
import ProjectStartScreen from "@/components/ProjectStartScreen";

interface TitleScreenProps {
	onStart: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
	return (
		<ProjectStartScreen
			title="Maze Generator & Solver"
			description="Interactive maze generator using recursive backtracking with manual solving and AI pathfinding algorithms (A* and BFS). Challenge yourself by solving mazes manually or watch the AI find the optimal path."
			features={[
				"Animated maze generation",
				"Manual solving with timer",
				"A* and BFS pathfinding",
				"Mobile-friendly controls"
			]}
			technologies={["React", "TypeScript", "Tailwind CSS", "Algorithms"]}
			buttonText="Start Game"
			onStart={onStart}
		/>
	);
};

export default TitleScreen;
