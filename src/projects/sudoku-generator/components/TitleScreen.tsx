import React from "react";
import ProjectStartScreen from "@/components/ProjectStartScreen";

interface TitleScreenProps {
	onStart: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
	return (
		<ProjectStartScreen
			title="Sudoku Generator & Solver"
			description="Interactive Sudoku puzzle generator with manual solving featuring pencil marks, hints, and AI solving algorithms (logical elimination and backtracking). Challenge yourself or watch the algorithms work."
			features={[
				"Animated puzzle generation",
				"Manual solving with pencil marks",
				"Logical & backtracking solvers",
				"Multiple difficulty levels",
				"Error detection & hints",
				"Touch-friendly interface"
			]}
			technologies={["React", "TypeScript", "Tailwind CSS", "Algorithms"]}
			buttonText="Start Game"
			onStart={onStart}
		/>
	);
};

export default TitleScreen;