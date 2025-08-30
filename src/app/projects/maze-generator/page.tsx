"use client";

import MazeGenerator from "@/projects/maze-generator";
import { ProjectNavigation } from "@/components/project-navigation";
import { useState } from "react";
import { GameState } from "@/projects/maze-generator/types";

export default function MazeGeneratorPage() {
	const [gameState, setGameState] = useState<GameState>("title");
	const [startOverTrigger, setStartOverTrigger] = useState(0);
	
	const handleStartOver = () => {
		setStartOverTrigger(prev => prev + 1);
	};

	const isStartScreen = gameState === "title";

	return (
		<div className="min-h-screen bg-background">
			<ProjectNavigation 
				projectTitle="Maze Generator & Solver"
				githubUrl="https://github.com/dmclemore/dmclemore.dev"
				onStartOver={handleStartOver}
				showStartOver={!isStartScreen}
			/>

			{/* Maze Generator Component */}
			<main className="pt-16 min-h-[calc(100vh-4rem)]">
				<MazeGenerator 
					key={startOverTrigger}
					onGameStateChange={setGameState}
				/>
			</main>
		</div>
	);
}
