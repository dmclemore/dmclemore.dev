import React, { useState } from "react";
import { SolvingAlgorithm } from "../types";

interface VictoryScreenProps {
	solveTime: number;
	onAutoSolve: (algorithm?: SolvingAlgorithm) => void;
	onResetPuzzle: () => void;
	onNewPuzzle: () => void;
	onStartOver: () => void;
	lastSolveMethod: 'manual' | 'auto' | null;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({
	solveTime,
	onAutoSolve,
	onResetPuzzle,
	onNewPuzzle,
	onStartOver,
	lastSolveMethod,
}) => {
	const [showAlgorithmSelect, setShowAlgorithmSelect] = useState(false);
	
	const formatTime = (ms: number): string => {
		const totalSeconds = Math.floor(ms / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		const milliseconds = ms % 1000;
		
		if (minutes > 0) {
			return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0").slice(0, 1)}`;
		}
		return `${seconds}.${milliseconds.toString().padStart(3, "0")}s`;
	};

	const getSuccessMessage = () => {
		if (lastSolveMethod === 'manual') {
			return "Excellent! You solved it manually!";
		} else if (lastSolveMethod === 'auto') {
			return "Algorithm completed the puzzle!";
		}
		return "Puzzle completed!";
	};

	const getTimeMessage = () => {
		if (lastSolveMethod === 'manual') {
			return "Your solving time:";
		} else if (lastSolveMethod === 'auto') {
			return "Algorithm time:";
		}
		return "Total time:";
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-background p-8 rounded-lg shadow-2xl max-w-md mx-4 text-center border border-border">
				<div className="mb-6">
					<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						{lastSolveMethod === 'manual' ? (
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
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						) : (
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
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
						)}
					</div>

					<h2 className="text-3xl font-bold text-foreground mb-2">
						Congratulations!
					</h2>

					<p className="text-muted-foreground mb-4">
						{getSuccessMessage()}
					</p>

					{solveTime > 0 && (
						<div className="bg-muted p-4 rounded-lg mb-6 border border-border">
							<p className="text-sm text-muted-foreground mb-1">{getTimeMessage()}</p>
							<p className="text-2xl font-bold text-green-600">
								{formatTime(solveTime)}
							</p>
							{lastSolveMethod === 'manual' && (
								<div className="text-xs text-muted-foreground mt-2">
									<p>Great job solving this manually!</p>
									<p>Try a harder difficulty next time.</p>
								</div>
							)}
						</div>
					)}
				</div>

				<div className="space-y-3">
					{/* Show algorithm selection or auto solve button */}
					{showAlgorithmSelect ? (
						<div className="space-y-3">
							<p className="text-sm text-muted-foreground text-center">
								Choose algorithm to see solution process:
							</p>
							<div className="grid grid-cols-1 gap-3">
								<button
									onClick={() => {
										onAutoSolve('logical');
										setShowAlgorithmSelect(false);
									}}
									className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
								>
									Logical Solver
									<div className="text-xs opacity-80">Uses elimination & constraint propagation</div>
								</button>
								<button
									onClick={() => {
										onAutoSolve('backtracking');
										setShowAlgorithmSelect(false);
									}}
									className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
								>
									Backtracking Solver
									<div className="text-xs opacity-80">Trial & error with visualization</div>
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
									See Algorithm Solution
								</button>
							)}

							{/* Reset puzzle button */}
							<button
								onClick={onResetPuzzle}
								className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
							>
								Try Same Puzzle Again
							</button>

							{/* New puzzle button */}
							<button
								onClick={onNewPuzzle}
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
							>
								Generate New Puzzle
							</button>

							{/* Return to menu */}
							<button
								onClick={onStartOver}
								className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
							>
								Back to Menu
							</button>
						</>
					)}
				</div>

				{lastSolveMethod === 'manual' && (
					<div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
						<p className="text-xs text-yellow-800">
							<strong>Pro tip:</strong> Try using pencil marks and logical techniques 
							to solve even harder puzzles!
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default VictoryScreen;