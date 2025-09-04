"use client";

import { useState } from "react";
import SudokuGenerator from "@/projects/sudoku-generator";
import { ProjectNavigation } from "@/components/project-navigation";
import { GameState } from "@/projects/sudoku-generator/types";

export default function SudokuGeneratorPage() {
	const [gameState, setGameState] = useState<GameState>("title");
	const [startOverTrigger, setStartOverTrigger] = useState(0);

	const handleStartOver = () => {
		setStartOverTrigger(prev => prev + 1);
	};

	const isStartScreen = gameState === "title";

	return (
		<div className="min-h-screen bg-background">
			<ProjectNavigation
				projectTitle="Sudoku Generator & Solver"
				githubUrl="https://github.com/dmclemore/dmclemore.dev/tree/main/src/projects/sudoku-generator"
				onStartOver={handleStartOver}
				showStartOver={!isStartScreen}
				showTitle={!isStartScreen}
			/>

			<main className="min-h-[calc(100vh-6rem)]">
				<SudokuGenerator
					key={startOverTrigger}
					onGameStateChange={setGameState}
				/>
			</main>
		</div>
	);
}
