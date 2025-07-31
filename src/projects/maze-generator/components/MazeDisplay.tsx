import React, { useState, useEffect } from "react";
import { Cell, MazeConfig, GameState, Algorithm } from "../types";

interface MazeDisplayProps {
	maze: Cell[][];
	config: MazeConfig;
	gameState: GameState;
	isGenerating: boolean;
	selectedAlgorithm: Algorithm;
	onAlgorithmChange: (algorithm: Algorithm) => void;
	onStartTimer: () => void;
	onAutoSolve: (algorithm?: Algorithm) => void;
	onClearBoard: () => void;
	onResetMaze: () => void;
	onCellMouseDown: (x: number, y: number) => void;
	onCellMouseEnter: (x: number, y: number) => void;
	onStartOver: () => void;
	solveStartTime: number | null;
	lastSolveMethod: "manual" | "auto" | null;
}

const MazeDisplay: React.FC<MazeDisplayProps> = ({
	maze,
	config,
	gameState,
	isGenerating: _isGenerating,
	selectedAlgorithm,
	onAlgorithmChange,
	onStartTimer,
	onAutoSolve,
	onClearBoard,
	onResetMaze,
	onCellMouseDown,
	onCellMouseEnter,
	onStartOver,
	solveStartTime,
	lastSolveMethod: _lastSolveMethod,
}) => {
	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		// Set initial size
		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	const getCellClassName = (cell: Cell): string => {
		const baseClass = "relative border-0 transition-colors duration-150";
		let colorClass = "bg-background";

		// Priority order: Start > End > Solution > User Path > Explored > Background
		if (cell.isStart) {
			colorClass = "bg-green-500";
		} else if (cell.isEnd) {
			colorClass = "bg-red-500";
		} else if (cell.isSolution) {
			colorClass = "bg-yellow-400";
		} else if (cell.isPath) {
			colorClass = "bg-blue-400";
		} else if (cell.isExplored) {
			colorClass = "bg-purple-300";
		}

		return `${baseClass} ${colorClass}`;
	};

	const getCellWallStyles = (cell: Cell): React.CSSProperties => {
		const style: React.CSSProperties = {};

		const wallColor = "hsl(var(--foreground))";

		if (cell.walls.top) {
			style.borderTopWidth = "1px";
			style.borderTopStyle = "solid";
			style.borderTopColor = wallColor;
		}
		if (cell.walls.right) {
			style.borderRightWidth = "1px";
			style.borderRightStyle = "solid";
			style.borderRightColor = wallColor;
		}
		if (cell.walls.bottom) {
			style.borderBottomWidth = "1px";
			style.borderBottomStyle = "solid";
			style.borderBottomColor = wallColor;
		}
		if (cell.walls.left) {
			style.borderLeftWidth = "1px";
			style.borderLeftStyle = "solid";
			style.borderLeftColor = wallColor;
		}

		return style;
	};

	const getCellSize = (): {
		className: string;
		style?: React.CSSProperties;
	} => {
		// Calculate optimal cell size based on available screen space
		const screenWidth = windowSize.width || 1024;
		const screenHeight = windowSize.height || 768;

		// Reserve space for sidebar (280px on large screens, none on mobile)
		const sidebarWidth = screenWidth >= 1024 ? 280 : 0;
		// Reserve space for padding and borders
		const reservedWidth = sidebarWidth + 100;
		const reservedHeight = 150;

		const availableWidth = screenWidth - reservedWidth;
		const availableHeight = screenHeight - reservedHeight;

		// Calculate max cell size that fits both dimensions
		const maxCellWidth = Math.floor(availableWidth / config.width);
		const maxCellHeight = Math.floor(availableHeight / config.height);
		const optimalSize = Math.min(maxCellWidth, maxCellHeight);

		// Clamp between reasonable bounds (minimum 10px, maximum 40px)
		const cellSize = Math.max(10, Math.min(40, optimalSize));

		// Use inline styles for precise control
		return {
			className:
				"border border-muted cursor-pointer transition-colors duration-150 flex-shrink-0 relative",
			style: {
				width: `${cellSize}px`,
				height: `${cellSize}px`,
				minWidth: `${cellSize}px`,
				minHeight: `${cellSize}px`,
			},
		};
	};

	const renderControls = () => {
		if (gameState === "generating") {
			return (
				<div>
					<h3 className="text-lg font-semibold text-foreground mb-3">Status</h3>
					<div className="flex items-center space-x-3 bg-primary/10 px-4 py-3 rounded-lg border border-primary/20">
						<div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
						<span className="text-primary font-medium">Generating maze...</span>
					</div>
				</div>
			);
		}

		if (gameState === "manual-solving") {
			return (
				<div>
					<h3 className="text-lg font-semibold text-foreground mb-3">
						Controls
					</h3>
					<div className="space-y-4">
						{!solveStartTime && (
							<button
								onClick={onStartTimer}
								className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
							>
								Start Timer
							</button>
						)}

						<div className="space-y-2">
							<label className="block text-sm font-medium text-foreground">
								Solving Algorithm:
							</label>
							<select
								value={selectedAlgorithm}
								onChange={e => onAlgorithmChange(e.target.value as Algorithm)}
								className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
							>
								<option value="astar">A* (Fastest Path)</option>
								<option value="bfs">BFS (Shortest Path)</option>
							</select>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<button
								onClick={() => onAutoSolve()}
								className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
							>
								Auto Solve
							</button>

							<button
								onClick={onClearBoard}
								className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
							>
								Clear Board
							</button>
						</div>

						<button
							onClick={onStartOver}
							className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
						>
							Start Over
						</button>

						{solveStartTime && (
							<div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-300">
								<p className="text-sm text-green-800 font-medium">
									🕒 Timer Active!
								</p>
								<p className="text-xs text-green-700 mt-1">
									Click and drag through the maze to solve it.
								</p>
							</div>
						)}
					</div>
				</div>
			);
		}

		if (gameState === "auto-solving") {
			return (
				<div>
					<h3 className="text-lg font-semibold text-foreground mb-3">
						Auto Solving
					</h3>
					<div className="space-y-4">
						<div className="flex items-center space-x-3 bg-purple-100 px-4 py-3 rounded-lg border border-purple-300">
							<div className="animate-pulse rounded-full h-5 w-5 bg-purple-600"></div>
							<div>
								<p className="text-purple-800 font-medium text-sm">
									Solving with {selectedAlgorithm === "astar" ? "A*" : "BFS"}
								</p>
								<p className="text-purple-600 text-xs">Finding path...</p>
							</div>
						</div>

						{solveStartTime && (
							<div className="p-3 bg-green-100 rounded-lg border border-green-300">
								<p className="text-sm text-green-800 font-medium">
									🕒 Timer Active!
								</p>
								<p className="text-xs text-green-700 mt-1">
									Auto-solving in progress...
								</p>
							</div>
						)}

						<button
							onClick={onStartOver}
							className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
						>
							Start Over
						</button>
					</div>
				</div>
			);
		}

		return null;
	};

	const renderLegend = () => (
		<div className="grid grid-cols-1 gap-3 text-sm">
			<div className="flex items-center space-x-3">
				<div className="w-5 h-5 bg-green-500 border border-border rounded"></div>
				<span className="text-foreground">Start Position</span>
			</div>
			<div className="flex items-center space-x-3">
				<div className="w-5 h-5 bg-red-500 border border-border rounded"></div>
				<span className="text-foreground">End Position</span>
			</div>
			<div className="flex items-center space-x-3">
				<div className="w-5 h-5 bg-blue-400 border border-border rounded"></div>
				<span className="text-foreground">Your Path</span>
			</div>
			<div className="flex items-center space-x-3">
				<div className="w-5 h-5 bg-purple-300 border border-border rounded"></div>
				<span className="text-foreground">Algorithm Explored</span>
			</div>
			<div className="flex items-center space-x-3">
				<div className="w-5 h-5 bg-yellow-400 border border-border rounded"></div>
				<span className="text-foreground">Solution Path</span>
			</div>
		</div>
	);

	if (maze.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-64">
				<div className="text-muted-foreground">Loading maze...</div>
			</div>
		);
	}

	const cellSizeConfig = getCellSize();

	return (
		<div className="w-full h-full flex flex-col lg:flex-row overflow-hidden gap-2 sm:gap-4 p-2 sm:p-4">
			{/* Main Game Board - Left Side */}
			<div className="flex-1 flex justify-center items-center min-h-0 order-2 lg:order-1">
				<div
					className="inline-block border-2 border-foreground select-none flex-shrink-0"
					style={{
						touchAction: "none",
						userSelect: "none",
					}}
				>
					{maze.map((row, y) => (
						<div key={y} className="flex">
							{row.map((cell, x) => (
								<div
									key={`${x}-${y}`}
									className={`${cellSizeConfig.className} ${getCellClassName(
										cell
									)} ${!cellSizeConfig.style ? "cursor-pointer" : ""}`}
									style={{
										...getCellWallStyles(cell),
										...cellSizeConfig.style,
										cursor: "pointer",
									}}
									onMouseDown={() => onCellMouseDown(x, y)}
									onMouseEnter={() => onCellMouseEnter(x, y)}
									onTouchStart={e => {
										e.preventDefault();
										onCellMouseDown(x, y);
									}}
									onTouchMove={e => {
										e.preventDefault();
										const touch = e.touches[0];
										const element = document.elementFromPoint(
											touch.clientX,
											touch.clientY
										);
										if (element && element.hasAttribute("data-cell")) {
											const [touchX, touchY] = element
												.getAttribute("data-cell")!
												.split("-")
												.map(Number);
											onCellMouseEnter(touchX, touchY);
										}
									}}
									data-cell={`${x}-${y}`}
								>
									{cell.isStart && (
										<div className="absolute inset-0 flex items-center justify-center">
											<span className="text-white font-bold text-xs sm:text-sm">
												S
											</span>
										</div>
									)}
									{cell.isEnd && (
										<div className="absolute inset-0 flex items-center justify-center">
											<span className="text-white font-bold text-xs sm:text-sm">
												E
											</span>
										</div>
									)}
								</div>
							))}
						</div>
					))}
				</div>
			</div>

			{/* Sidebar - Right Side */}
			<div className="w-full lg:w-64 xl:w-72 flex-shrink-0 bg-muted/30 rounded-lg p-3 sm:p-4 border border-border overflow-auto order-1 lg:order-2 max-h-64 lg:max-h-none">
				<div className="space-y-4 sm:space-y-6">
					{/* Controls Section */}
					<div>{renderControls()}</div>

					{/* Legend Section */}
					<div>
						<h3 className="text-lg font-semibold text-foreground mb-3">
							Legend
						</h3>
						{renderLegend()}
					</div>

					{/* Instructions Section */}
					<div>
						<h3 className="text-lg font-semibold text-foreground mb-3">
							Instructions
						</h3>
						<div className="text-sm text-muted-foreground space-y-2">
							<p>
								<strong>Start:</strong> Begin at the green start position and
								navigate to the red end.
							</p>
							<p>
								<strong>Movement:</strong> Only move to adjacent cells (up,
								down, left, right) through open passages.
							</p>
							<p>
								<strong>Mouse/Touch:</strong> Click and drag through valid paths
								only.
							</p>
							<p>
								<strong>Keyboard:</strong> Arrow keys to move, Backspace to undo
								last move.
							</p>
							<p>
								<strong>Path Editing:</strong> Click any cell in your current
								path to remove everything after it.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MazeDisplay;
