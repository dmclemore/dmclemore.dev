"use client";

import QueueStackVisualizer from "@/projects/queue-stack";
import { ProjectNavigation } from "@/components/project-navigation";
import { useState, useRef } from "react";
import { ViewMode } from "@/projects/queue-stack/types";

export default function QueueStackPage() {
	const [gameState, setGameState] = useState<ViewMode>("start");
	const [startOverTrigger, setStartOverTrigger] = useState(0);
	const visualizerRef = useRef<{ switchView: () => void } | null>(null);

	const handleStartOver = () => {
		setStartOverTrigger(prev => prev + 1);
	};

	const handleSwitch = () => {
		// We'll need to pass this to the visualizer component
		if (visualizerRef.current?.switchView) {
			visualizerRef.current.switchView();
		}
	};

	const isStartScreen = gameState === "start";
	const isInDemo = gameState === "queue" || gameState === "stack";
	const switchButtonText = gameState === "queue" ? "Switch to Stack" : "Switch to Queue";

	return (
		<div className="min-h-screen bg-background">
			<ProjectNavigation
				projectTitle="Queue & Stack Visualizer"
				githubUrl="https://github.com/dmclemore/dmclemore.dev/tree/main/src/projects/queue-stack"
				onStartOver={handleStartOver}
				showStartOver={!isStartScreen}
				showTitle={!isStartScreen}
				switchButtonText={switchButtonText}
				onSwitchClick={handleSwitch}
				showSwitchButton={isInDemo}
			/>

			<main className={isStartScreen ? "" : "min-h-[calc(100vh-6rem)]"}>
				<QueueStackVisualizer
					key={startOverTrigger}
					onGameStateChange={setGameState}
					ref={visualizerRef}
				/>
			</main>
		</div>
	);
}