"use client";

import React, { useState, useCallback, useEffect } from "react";
import { SudokuCell, SudokuConfig, GameState, SolvingAlgorithm, SudokuGrid, SolverStep } from "./types";
import TitleScreen from "./components/TitleScreen";
import ConfigScreen from "./components/ConfigScreen";
import SudokuDisplay from "./components/SudokuDisplay";
import VictoryScreen from "./components/VictoryScreen";
import { generateSudoku, convertToSudokuCells } from "./utils";
import { LogicalSolver, BacktrackingSolver } from "./utils";

interface SudokuGeneratorProps {
	onGameStateChange?: (gameState: GameState) => void;
}

const SudokuGenerator: React.FC<SudokuGeneratorProps> = ({ onGameStateChange }) => {
	const [gameState, setGameState] = useState<GameState>("title");

	// Notify parent component of game state changes
	useEffect(() => {
		onGameStateChange?.(gameState);
	}, [gameState, onGameStateChange]);

	const [sudokuGrid, setSudokuGrid] = useState<SudokuGrid>({
		cells: [],
		originalGrid: [],
		solutionGrid: [],
	});
	const [config, setConfig] = useState<SudokuConfig>({
		difficulty: 'medium',
		clues: 32,
		generationSpeed: 50,
	});
	const [isGenerating, setIsGenerating] = useState(false);
	const [selectedAlgorithm, setSelectedAlgorithm] = useState<SolvingAlgorithm>("logical");
	const [lastSolveMethod, setLastSolveMethod] = useState<"manual" | "auto" | null>(null);

	const handleStartGame = useCallback(() => {
		setGameState("config");
	}, []);

	const handleConfigComplete = useCallback((newConfig: SudokuConfig) => {
		setConfig(newConfig);
		setGameState("generating");
		setIsGenerating(true);

		generateSudoku(
			newConfig.clues,
			newConfig.generationSpeed,
			(cells: SudokuCell[][]) => {
				// Update display during generation
				setSudokuGrid(prev => ({
					...prev,
					cells,
				}));
			},
			(finalGrid: SudokuGrid) => {
				setSudokuGrid(finalGrid);
				setIsGenerating(false);
				setGameState("manual-solving");
			}
		);
	}, []);


	const handleClearBoard = useCallback(() => {
		if (!sudokuGrid.originalGrid.length) return;
		
		// Reset to original puzzle state
		const newCells = convertToSudokuCells(sudokuGrid.originalGrid);

		setSudokuGrid(prev => ({
			...prev,
			cells: newCells,
		}));
	}, [sudokuGrid.originalGrid]);

	const handleResetPuzzle = useCallback(() => {
		setGameState("manual-solving");
		setLastSolveMethod(null);

		// Reset to original puzzle state
		const newCells = convertToSudokuCells(sudokuGrid.originalGrid);

		setSudokuGrid(prev => ({
			...prev,
			cells: newCells,
		}));
	}, [sudokuGrid.originalGrid]);

	const handleAutoSolve = useCallback(
		(algorithm?: SolvingAlgorithm) => {
			if (sudokuGrid.cells.length === 0) return;

			const algorithmToUse = algorithm || selectedAlgorithm;
			setSelectedAlgorithm(algorithmToUse);

			setGameState("auto-solving");

			// Reset to original puzzle state before solving
			const cleanCells = convertToSudokuCells(sudokuGrid.originalGrid);

			setSudokuGrid(prev => ({
				...prev,
				cells: cleanCells,
			}));

			const solver = algorithmToUse === "logical" ? 
				new LogicalSolver(cleanCells) : 
				new BacktrackingSolver(cleanCells);

			// Use slower speed for logical solver to make steps more visible
			const solverSpeed = algorithmToUse === "logical" ? 250 : config.generationSpeed;

			solver.solve(
				(updatedCells: SudokuCell[][]) => {
					setSudokuGrid(prev => ({
						...prev,
						cells: updatedCells,
					}));
				},
				solverSpeed,
				() => {
					setGameState("victory");
					setLastSolveMethod("auto");
				}
			);
		},
		[sudokuGrid, config, selectedAlgorithm]
	);

	const handleGridUpdate = useCallback((newGrid: SudokuGrid) => {
		setSudokuGrid(newGrid);
	}, []);

	const handleVictory = useCallback(() => {
		setGameState("victory");
		setLastSolveMethod("manual");
	}, []);

	const handleNewPuzzle = useCallback(() => {
		setGameState("config");
		setSudokuGrid({
			cells: [],
			originalGrid: [],
			solutionGrid: [],
		});
		setLastSolveMethod(null);
	}, []);

	const handleStartOver = useCallback(() => {
		setGameState("title");
		setSudokuGrid({
			cells: [],
			originalGrid: [],
			solutionGrid: [],
		});
		setLastSolveMethod(null);
	}, []);



	const renderCurrentScreen = () => {
		switch (gameState) {
			case "title":
				return <TitleScreen onStart={handleStartGame} />;

			case "config":
				return (
					<ConfigScreen
						config={config}
						onConfigComplete={handleConfigComplete}
					/>
				);

			case "generating":
			case "manual-solving":
			case "auto-solving":
				return (
					<SudokuDisplay
						grid={sudokuGrid}
						gameState={gameState}
						isGenerating={isGenerating}
						selectedAlgorithm={selectedAlgorithm}
						onAlgorithmChange={setSelectedAlgorithm}
						onAutoSolve={handleAutoSolve}
						onClearBoard={handleClearBoard}
						onGridUpdate={handleGridUpdate}
						onVictory={handleVictory}
					/>
				);

			case "victory":
				return (
					<VictoryScreen
						solveTime={0}
						onAutoSolve={handleAutoSolve}
						onResetPuzzle={handleResetPuzzle}
						onNewPuzzle={handleNewPuzzle}
						onStartOver={handleStartOver}
						lastSolveMethod={lastSolveMethod}
					/>
				);

			default:
				return null;
		}
	};

	const isStartScreen = gameState === "title";

	return (
		<div className="w-full h-full flex flex-col bg-background">
			<div className="flex-1 overflow-auto">
				<div className={isStartScreen ? "" : "p-2 sm:p-4"}>
					{renderCurrentScreen()}
				</div>
			</div>
		</div>
	);
};

export default SudokuGenerator;