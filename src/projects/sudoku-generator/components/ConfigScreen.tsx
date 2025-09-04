import React, { useState } from "react";
import { SudokuConfig } from "../types";

interface ConfigScreenProps {
	config: SudokuConfig;
	onConfigComplete: (config: SudokuConfig) => void;
}

const ConfigScreen: React.FC<ConfigScreenProps> = ({
	config,
	onConfigComplete,
}) => {
	const [difficulty, setDifficulty] = useState(config.difficulty);
	const [customClues, setCustomClues] = useState(config.clues);

	const difficultySettings = {
		easy: { clues: 40, name: "Easy", description: "35-40 clues - Great for beginners" },
		medium: { clues: 32, name: "Medium", description: "30-35 clues - Moderate challenge" },
		hard: { clues: 27, name: "Hard", description: "25-30 clues - Requires strategy" },
		expert: { clues: 22, name: "Expert", description: "17-25 clues - Very challenging" },
		custom: { clues: customClues, name: "Custom", description: `${customClues} clues - Your choice` }
	};

	const handleDifficultyChange = (newDifficulty: SudokuConfig['difficulty']) => {
		setDifficulty(newDifficulty);
		if (newDifficulty !== 'custom') {
			setCustomClues(difficultySettings[newDifficulty].clues);
		}
	};

	const handleCustomCluesChange = (clues: number) => {
		const boundedClues = Math.max(17, Math.min(40, clues));
		setCustomClues(boundedClues);
		setDifficulty('custom');
	};

	const handleGenerate = () => {
		const finalClues = difficulty === 'custom' ? customClues : difficultySettings[difficulty].clues;
		
		const finalConfig: SudokuConfig = {
			difficulty,
			clues: finalClues,
			generationSpeed: 50, // Fixed generation speed
		};

		onConfigComplete(finalConfig);
	};

	const renderSampleGrid = () => {
		const cellSize = 48;

		// Calculate which cells should be shown based on current difficulty
		const currentClues = difficulty === 'custom' ? customClues : difficultySettings[difficulty].clues;
		
		// Seeded random for consistent clue positioning
		const seededRandom = (seed: number) => {
			const x = Math.sin(seed) * 10000;
			return x - Math.floor(x);
		};

		// Generate shuffled positions for clue selection
		const allPositions: [number, number][] = [];
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				allPositions.push([row, col]);
			}
		}

		const fixedSeed = 12345;
		const shuffledPositions = [...allPositions];
		
		// Fisher-Yates shuffle with seeded random
		for (let i = shuffledPositions.length - 1; i > 0; i--) {
			const j = Math.floor(seededRandom(fixedSeed + i) * (i + 1));
			[shuffledPositions[i], shuffledPositions[j]] = [shuffledPositions[j], shuffledPositions[i]];
		}

		const cluePositions = shuffledPositions.slice(0, Math.min(currentClues, 81));

		return (
			<div className="flex justify-center">
				<div 
					className="inline-block border-2 border-foreground bg-background select-none"
					style={{
						width: `${9 * cellSize + 4}px`,
						height: `${9 * cellSize + 4}px`,
					}}
				>
					{Array(9).fill(null).map((_, rowIndex) => (
						<div key={rowIndex} className="flex">
							{Array(9).fill(null).map((_, colIndex) => {
								const isBoxBorder = {
									right: colIndex === 2 || colIndex === 5,
									bottom: rowIndex === 2 || rowIndex === 5,
								};

								// Check if this position should show a clue based on current difficulty
								const shouldShowClue = cluePositions.some(([r, c]) => r === rowIndex && c === colIndex);

								return (
									<div
										key={`${rowIndex}-${colIndex}`}
										className={`
											flex items-center justify-center bg-background text-foreground font-medium text-sm
											border-r border-b border-gray-300 dark:border-gray-500
											${isBoxBorder.right ? 'border-r-2 border-r-foreground' : ''}
											${isBoxBorder.bottom ? 'border-b-2 border-b-foreground' : ''}
										`}
										style={{
											width: `${cellSize}px`,
											height: `${cellSize}px`,
										}}
									>
										{shouldShowClue ? '?' : ''}
									</div>
								);
							})}
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<div className="w-full h-full flex flex-col lg:flex-row items-center overflow-hidden gap-6 p-2 sm:p-4 bg-background">
			<h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 text-center lg:hidden">
				Configure Your Puzzle
			</h2>

			{/* Sample Grid - Centered in remaining space */}
			<div className="flex-1 flex justify-center items-center order-2 lg:order-1">
				{renderSampleGrid()}
			</div>

			{/* Configuration Options - Far right */}
			<div className="w-full lg:w-80 xl:w-96 flex-shrink-0 bg-muted/30 rounded-lg p-3 sm:p-4 border border-border overflow-auto order-1 lg:order-2 max-h-64 lg:max-h-none">
				<div className="space-y-4 sm:space-y-6">
					<div className="hidden lg:block">
						<h2 className="text-xl font-bold text-foreground mb-4 text-center">
							Configure Your Puzzle
						</h2>
					</div>

					{/* Difficulty Configuration */}
					<div>
						<h3 className="text-lg font-semibold text-foreground mb-4">
							Difficulty Level
						</h3>

						<div className="grid grid-cols-2 gap-3 mb-4">
							{Object.entries(difficultySettings).filter(([key]) => key !== 'custom').map(([key, setting]) => (
								<button
									key={key}
									onClick={() => handleDifficultyChange(key as SudokuConfig['difficulty'])}
									className={`text-left p-3 rounded-md font-medium transition-colors border ${
										difficulty === key
											? "bg-primary text-primary-foreground border-primary"
											: "bg-background text-foreground border-border hover:bg-secondary"
									}`}
								>
									<div className="font-semibold text-sm">{setting.name}</div>
									<div className="text-xs opacity-80">{setting.description}</div>
								</button>
							))}
						</div>

						{/* Custom Clues Slider */}
						<div className="border-t border-border pt-4">
							<div className="flex items-center justify-between mb-2">
								<label className="text-sm font-medium text-foreground">
									Custom Clues
								</label>
								<span className="text-sm text-muted-foreground">
									{customClues} clues
								</span>
							</div>
							<input
								type="range"
								min="17"
								max="40"
								value={customClues}
								onChange={e => handleCustomCluesChange(parseInt(e.target.value))}
								className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
							/>
							<div className="flex justify-between text-xs text-muted-foreground mt-1">
								<span>Expert (17)</span>
								<span>Easy (40)</span>
							</div>
						</div>
					</div>


					{/* Generate Button */}
					<div className="text-center">
						<button
							onClick={handleGenerate}
							className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
						>
							Generate Puzzle
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ConfigScreen;