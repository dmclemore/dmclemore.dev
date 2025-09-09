import React from "react";
import ProjectStartScreen from "@/components/ProjectStartScreen";

interface StartScreenProps {
	onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
	return (
		<ProjectStartScreen
			title="Queue & Stack Visualizer"
			description="Interactive data structure visualizer featuring animated queue (FIFO) and stack (LIFO) operations with educational content and real-world examples. Learn fundamental computer science concepts through engaging visualizations."
			features={[
				"Interactive queue (FIFO) visualization",
				"Interactive stack (LIFO) visualization", 
				"Animated stick figures and pancakes",
				"Adjustable animation speeds",
				"Auto-play and manual modes",
				"Real-world application examples"
			]}
			technologies={["React", "TypeScript", "Tailwind CSS", "Data Structures"]}
			buttonText="Start Demo"
			onStart={onStart}
		/>
	);
};

export default StartScreen;