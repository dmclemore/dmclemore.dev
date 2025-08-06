import React, { useState } from "react";
import { Algorithm } from "../types";

interface VictoryScreenProps {
	solveTime: number;
	onAutoSolve: (algorithm?: Algorithm) => void;
	onResetMaze: () => void;
	onStartOver: () => void;
	lastSolveMethod: 'manual' | 'auto' | null;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({
	solveTime,
	onAutoSolve,
	onResetMaze,
	onStartOver,
	lastSolveMethod,
}) => {
	const [showAlgorithmSelect, setShowAlgorithmSelect] = useState(false);
	const formatTime = (ms: number): string => {
		const seconds = Math.floor(ms / 1000);
		const milliseconds = ms % 1000;
		return `${seconds}.${milliseconds.toString().padStart(3, "0")}s`;
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-background p-8 rounded-lg shadow-2xl max-w-md mx-4 text-center border border-border">
				<div className="mb-6">
					<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg
							className="w-8 h-8 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>

					<h2 className="text-3xl font-bold text-foreground mb-2">
						Congratulations!
					</h2>

					<p className="text-muted-foreground mb-4">
						You successfully solved the maze!
					</p>

					{solveTime > 0 && (
						<div className="bg-muted p-4 rounded-lg mb-6 border border-border">
							<p className="text-sm text-muted-foreground mb-1">Your Time:</p>
							<p className="text-2xl font-bold text-green-600">
								{formatTime(solveTime)}
							</p>
						</div>
					)}
				</div>

				<div className="space-y-3">
					{/* Show algorithm selection or auto solve button */}
					{showAlgorithmSelect ? (
						<div className="space-y-3">
							<p className="text-sm text-muted-foreground text-center">Choose algorithm for auto solution:</p>
							<div className="grid grid-cols-2 gap-3">
								<button
									onClick={() => {
										onAutoSolve('astar');
										setShowAlgorithmSelect(false);
									}}
									className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
								>
									A* Algorithm
								</button>
								<button
									onClick={() => {
										onAutoSolve('bfs');
										setShowAlgorithmSelect(false);
									}}
									className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
								>
									BFS Algorithm
								</button>
							</div>
							<button
								onClick={() => setShowAlgorithmSelect(false)}
								className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
							>
								Cancel
							</button>
						</div>
					) : (
						<>
							{/* Only show auto solve button if it wasn't just used */}
							{lastSolveMethod !== 'auto' && (
								<button
									onClick={() => setShowAlgorithmSelect(true)}
									className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
								>
									See Auto Solution
								</button>
							)}

							{/* Reset maze button */}
							<button
								onClick={onResetMaze}
								className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
							>
								Reset Same Maze
							</button>

							<button
								onClick={onStartOver}
								className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
							>
								Start Over
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default VictoryScreen;
