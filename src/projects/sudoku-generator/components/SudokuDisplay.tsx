import React, { useState, useEffect, useCallback } from "react";
import { SudokuCell, GameState, SolvingAlgorithm, InputMode, SudokuGrid } from "../types";
import { getPossibleValues, hasConflicts } from "../utils/validation";
import { deepCloneGrid } from "../utils/common";

interface SudokuDisplayProps {
	grid: SudokuGrid;
	gameState: GameState;
	isGenerating: boolean;
	selectedAlgorithm: SolvingAlgorithm;
	onAlgorithmChange: (algorithm: SolvingAlgorithm) => void;
	onAutoSolve: (algorithm?: SolvingAlgorithm) => void;
	onClearBoard: () => void;
	onGridUpdate: (grid: SudokuGrid) => void;
	onVictory: () => void;
}

const SudokuDisplay: React.FC<SudokuDisplayProps> = ({
	grid,
	gameState,
	isGenerating: _isGenerating,
	selectedAlgorithm,
	onAlgorithmChange,
	onAutoSolve,
	onClearBoard,
	onGridUpdate,
	onVictory,
}) => {
	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
	const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
	const [inputMode, setInputMode] = useState<InputMode>('pencil');
	const [showErrors, setShowErrors] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const getCellSize = useCallback((): {
		className: string;
		style?: React.CSSProperties;
	} => {
		const screenWidth = windowSize.width || 1024;
		const screenHeight = windowSize.height || 768;

		const sidebarWidth = screenWidth >= 1024 ? 280 : 0;
		const reservedWidth = sidebarWidth + 100;
		const reservedHeight = 200;

		const availableWidth = screenWidth - reservedWidth;
		const availableHeight = screenHeight - reservedHeight;

		const maxCellWidth = Math.floor(availableWidth / 9);
		const maxCellHeight = Math.floor(availableHeight / 9);
		const optimalSize = Math.min(maxCellWidth, maxCellHeight);

		const cellSize = Math.max(35, Math.min(60, optimalSize));

		return {
			className: "cursor-pointer transition-all duration-150 flex-shrink-0 relative",
			style: {
				width: `${cellSize}px`,
				height: `${cellSize}px`,
				minWidth: `${cellSize}px`,
				minHeight: `${cellSize}px`,
			},
		};
	}, [windowSize]);

	const handleCellClick = (x: number, y: number) => {
		if (gameState !== "manual-solving") return;

		setSelectedCell({ x, y });
	};

	const handleNumberInput = useCallback((num: number) => {
		if (!selectedCell || gameState !== "manual-solving") return;
		
		const cell = grid.cells[selectedCell.y][selectedCell.x];
		if (cell.isGiven) return;

		const newGrid = { ...grid };
		const newCells = deepCloneGrid(newGrid.cells);

		if (inputMode === 'pen') {
			// Pen mode: place final answer
			newCells[selectedCell.y][selectedCell.x].value = 
				newCells[selectedCell.y][selectedCell.x].value === num ? 0 : num;
			newCells[selectedCell.y][selectedCell.x].pencilMarks.clear();
		} else {
			// Pencil mode: toggle pencil mark
			const marks = newCells[selectedCell.y][selectedCell.x].pencilMarks;
			if (marks.has(num)) {
				marks.delete(num);
			} else {
				marks.add(num);
			}
		}

		newGrid.cells = newCells;
		onGridUpdate(newGrid);

		// Check for victory
		if (isSolved(newCells)) {
			onVictory();
		}
	}, [selectedCell, gameState, grid, inputMode, onGridUpdate, onVictory]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (gameState !== "manual-solving" || !selectedCell) return;

			switch (e.key) {
				case "ArrowUp":
					e.preventDefault();
					setSelectedCell(prev => prev ? {
						x: prev.x,
						y: Math.max(0, prev.y - 1)
					} : null);
					break;
				case "ArrowDown":
					e.preventDefault();
					setSelectedCell(prev => prev ? {
						x: prev.x,
						y: Math.min(8, prev.y + 1)
					} : null);
					break;
				case "ArrowLeft":
					e.preventDefault();
					setSelectedCell(prev => prev ? {
						x: Math.max(0, prev.x - 1),
						y: prev.y
					} : null);
					break;
				case "ArrowRight":
					e.preventDefault();
					setSelectedCell(prev => prev ? {
						x: Math.min(8, prev.x + 1),
						y: prev.y
					} : null);
					break;
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
				case "7":
				case "8":
				case "9":
					e.preventDefault();
					handleNumberInput(parseInt(e.key));
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [gameState, selectedCell, handleNumberInput]);

	const handleHint = () => {
		if (!selectedCell || gameState !== "manual-solving") return;

		const possibles = getPossibleValues(grid.cells, selectedCell.y, selectedCell.x);
		const newGrid = { ...grid };
		const newCells = deepCloneGrid(newGrid.cells);

		// Add possible values as pencil marks
		possibles.forEach(num => {
			newCells[selectedCell.y][selectedCell.x].pencilMarks.add(num);
		});

		newGrid.cells = newCells;
		onGridUpdate(newGrid);
	};

	const handleClear = () => {
		if (!selectedCell || gameState !== "manual-solving") return;

		const cell = grid.cells[selectedCell.y][selectedCell.x];
		if (cell.isGiven) return;

		const newGrid = { ...grid };
		const newCells = deepCloneGrid(newGrid.cells);
		
		newCells[selectedCell.y][selectedCell.x].value = 0;
		newCells[selectedCell.y][selectedCell.x].pencilMarks.clear();

		newGrid.cells = newCells;
		onGridUpdate(newGrid);
	};

	const getCellDisplayValue = (cell: SudokuCell, gameState: GameState): string => {
		if (cell.value === 0) return '';
		if (gameState === "generating") return '?';
		return cell.value.toString();
	};

	const isSolved = (cells: SudokuCell[][]): boolean => {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				if (cells[row][col].value === 0) return false;
			}
		}
		return true;
	};


	const getCellStyle = (cell: SudokuCell, x: number, y: number): {
		style: React.CSSProperties;
		className: string;
	} => {
		const isSelected = selectedCell?.x === x && selectedCell?.y === y;
		const hasConflict = showErrors && hasConflicts(grid.cells, y, x);

		const isBoxBorder = {
			right: x === 2 || x === 5,
			bottom: y === 2 || y === 5,
		};

		// Build className for borders - matching config screen
		const borderClasses = [
			'border-r border-b border-gray-300 dark:border-gray-500',
			isBoxBorder.right ? 'border-r-2 border-r-foreground' : '',
			isBoxBorder.bottom ? 'border-b-2 border-b-foreground' : '',
		].filter(Boolean).join(' ');

		return {
			style: {
				fontWeight: cell.isGiven ? 'bold' : 'normal',
			},
			className: `flex items-center justify-center font-medium ${borderClasses} ${
				hasConflict ? 'bg-red-50 text-red-600' : 
				cell.hasError ? 'bg-red-50 text-red-600' :
				cell.isHighlighted ? 'bg-yellow-50 text-foreground' :
				isSelected ? 'bg-muted text-foreground' : 
				'bg-background text-foreground'
			} ${
				hasConflict ? '' : 
				cell.isGiven ? 'text-foreground' : 'text-foreground'
			}`,
		};
	};

	const renderPencilMarks = (cell: SudokuCell) => {
		if (cell.value !== 0 || cell.pencilMarks.size === 0) return null;

		return (
			<div className="absolute inset-1 grid grid-cols-3 gap-0 text-xs leading-none">
				{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
					<div key={num} className="flex items-center justify-center text-gray-500">
						{cell.pencilMarks.has(num) ? num : ''}
					</div>
				))}
			</div>
		);
	};

	const renderControls = () => {
		if (gameState === "generating") {
			return (
				<div>
					<h3 className="text-lg font-semibold text-foreground mb-3">Status</h3>
					<div className="flex items-center space-x-3 bg-primary/10 px-4 py-3 rounded-lg border border-primary/20">
						<div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
						<span className="text-primary font-medium">Generating puzzle...</span>
					</div>
				</div>
			);
		}

		if (gameState === "manual-solving") {
			return (
				<div className="space-y-4">
					{/* Instructions */}
					<div className="space-y-2">
						<h4 className="text-sm font-medium text-foreground">Instructions:</h4>
						<div className="text-xs text-muted-foreground space-y-1">
							<p><strong>Goal:</strong> Fill each row, column, and 3×3 box with 1-9.</p>
							<p><strong>Pen:</strong> Place final answers.</p>
							<p><strong>Pencil:</strong> Add/remove candidate numbers.</p>
							<p><strong>Hint:</strong> Click cell, then "Hint" for possibles.</p>
						</div>
					</div>

					{/* Input Mode Toggle */}
					<div className="space-y-2">
						<label className="block text-sm font-medium text-foreground">Input Mode:</label>
						<div className="space-y-2">
							<button
								onClick={() => setInputMode('pencil')}
								className={`w-full py-2 px-3 rounded-md font-medium transition-colors text-sm ${
									inputMode === 'pencil'
										? "bg-primary text-primary-foreground"
										: "bg-background text-foreground border border-border hover:bg-secondary"
								}`}
							>
								Pencil
							</button>
							<button
								onClick={() => setInputMode('pen')}
								className={`w-full py-2 px-3 rounded-md font-medium transition-colors text-sm ${
									inputMode === 'pen'
										? "bg-primary text-primary-foreground"
										: "bg-background text-foreground border border-border hover:bg-secondary"
								}`}
							>
								Pen
							</button>
							<button
								onClick={handleClear}
								disabled={!selectedCell}
								className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
							>
								Clear
							</button>
						</div>
					</div>

					{/* Actions Section */}
					<div className="space-y-2">
						<h4 className="text-sm font-medium text-foreground">Actions:</h4>
						<div className="grid grid-cols-2 gap-2">
							<button
								onClick={handleHint}
								disabled={!selectedCell}
								className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
							>
								Hint
							</button>
							<button
								onClick={() => setShowErrors(!showErrors)}
								className={`font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-sm ${
									showErrors ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'
								}`}
							>
								{showErrors ? 'Hide Errors' : 'Show Errors'}
							</button>
							<button
								onClick={onClearBoard}
								className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-sm col-span-2"
							>
								Clear Board
							</button>
						</div>
					</div>

					{/* Solving Section */}
					<div className="space-y-2">
						<label className="block text-sm font-medium text-foreground">
							Solving Algorithm:
						</label>
						<select
							value={selectedAlgorithm}
							onChange={e => onAlgorithmChange(e.target.value as SolvingAlgorithm)}
							className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
						>
							<option value="logical">Logical (Elimination)</option>
							<option value="backtracking">Backtracking (Brute Force)</option>
						</select>
						<button
							onClick={() => onAutoSolve()}
							className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
						>
							Auto Solve
						</button>
					</div>
				</div>
			);
		}

		if (gameState === "auto-solving") {
			return (
				<div>
					<h3 className="text-lg font-semibold text-foreground mb-3">Auto Solving</h3>
					<div className="space-y-4">
						<div className="flex items-center space-x-3 bg-purple-100 px-4 py-3 rounded-lg border border-purple-300">
							<div className="animate-pulse rounded-full h-5 w-5 bg-purple-600"></div>
							<div>
								<p className="text-purple-800 font-medium text-sm">
									Solving with {selectedAlgorithm === "logical" ? "Logical Methods" : "Backtracking"}
								</p>
								<p className="text-purple-600 text-xs">
									{"Finding solution..."}
								</p>
							</div>
						</div>
						
						{selectedAlgorithm === "logical" && (
							<div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
								<h4 className="text-blue-800 font-medium text-sm mb-2">How Logical Solving Works:</h4>
								<div className="text-blue-700 text-xs space-y-1">
									<p><strong>Naked Singles:</strong> Cells with only one possible value</p>
									<p><strong>Hidden Singles:</strong> Numbers that can only go in one cell</p>
									<p><strong>Constraint Propagation:</strong> Eliminating impossible values</p>
									<p className="pt-1 text-blue-600">Watch as the algorithm finds logical deductions!</p>
								</div>
							</div>
						)}

						{selectedAlgorithm === "backtracking" && (
							<div className="bg-orange-50 px-4 py-3 rounded-lg border border-orange-200">
								<h4 className="text-orange-800 font-medium text-sm mb-2">How Backtracking Works:</h4>
								<div className="text-orange-700 text-xs space-y-1">
									<p><strong>Trial & Error:</strong> Try each number 1-9 in empty cells</p>
									<p><strong>Forward:</strong> If valid, move to next empty cell</p>
									<p><strong>Backtrack:</strong> If stuck, undo and try next number</p>
									<p className="pt-1 text-orange-600">The white cell shows where the algorithm is currently working!</p>
								</div>
							</div>
						)}
					</div>
				</div>
			);
		}

		return null;
	};

	const renderNumberPad = () => {
		if (gameState !== "manual-solving" || !selectedCell) return null;

		return (
			<div className="space-y-3">
				<h4 className="text-md font-semibold text-foreground">Number Pad</h4>
				<div className="grid grid-cols-3 gap-2">
					{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
						<button
							key={num}
							onClick={() => handleNumberInput(num)}
							className="aspect-square bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
						>
							{num}
						</button>
					))}
				</div>
			</div>
		);
	};

	if (!grid.cells || grid.cells.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-64">
				<div className="text-muted-foreground">Loading puzzle...</div>
			</div>
		);
	}

	const cellSizeConfig = getCellSize();

	return (
		<div className="w-full h-full flex flex-col lg:flex-row overflow-hidden gap-2 sm:gap-4 p-2 sm:p-4">
			{/* Main Sudoku Grid - Left Side */}
			<div className="flex-1 flex justify-center items-center min-h-0 order-2 lg:order-1">
				<div
					className="inline-block border-2 border-foreground bg-background select-none flex-shrink-0"
					style={{ touchAction: "none", userSelect: "none" }}
				>
					{grid.cells.map((row, y) => (
						<div key={y} className="flex">
							{row.map((cell, x) => {
								const cellStyleConfig = getCellStyle(cell, x, y);
								return (
									<div
										key={`${x}-${y}`}
										className={`${cellSizeConfig.className} ${cellStyleConfig.className}`}
										style={{
											...cellStyleConfig.style,
											...cellSizeConfig.style,
										}}
										onClick={() => handleCellClick(x, y)}
									>
										<div className="absolute inset-0 flex items-center justify-center font-medium text-lg">
											{getCellDisplayValue(cell, gameState)}
										</div>
{renderPencilMarks(cell)}
									</div>
								);
							})}
						</div>
					))}
				</div>
			</div>

			{/* Sidebar - Right Side */}
			<div className="w-full lg:w-64 xl:w-72 flex-shrink-0 bg-muted/30 rounded-lg p-3 sm:p-4 border border-border overflow-auto order-1 lg:order-2 max-h-96 lg:max-h-none">
				<div className="space-y-4 sm:space-y-6">
					{/* Controls Section */}
					<div>{renderControls()}</div>
				</div>
			</div>

			{/* Number Pad - Only show on mobile */}
			{gameState === "manual-solving" && selectedCell && (
				<div className="w-full lg:hidden flex-shrink-0 bg-muted/30 rounded-lg p-3 sm:p-4 border border-border order-3">
					<div className="space-y-3">
						<h4 className="text-md font-semibold text-foreground">Number Pad</h4>
						<div className="grid grid-cols-3 gap-2">
							{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
								<button
									key={num}
									onClick={() => handleNumberInput(num)}
									className="aspect-square bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
								>
									{num}
								</button>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default SudokuDisplay;