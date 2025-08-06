import React, { useState, useEffect } from "react";
import { MazeConfig } from "../types";
import { getCellStyle } from "../utils/mazeDisplay";

interface ConfigScreenProps {
	config: MazeConfig;
	onConfigComplete: (config: MazeConfig) => void;
}

const ConfigScreen: React.FC<ConfigScreenProps> = ({
	config,
	onConfigComplete,
}) => {
	const [width, setWidth] = useState(config.width);
	const [height, setHeight] = useState(config.height);
	const [startX, setStartX] = useState(config.startX);
	const [startY, setStartY] = useState(config.startY);
	const [endX, setEndX] = useState(config.endX);
	const [endY, setEndY] = useState(config.endY);
	const [generationSpeed, setGenerationSpeed] = useState(
		config.generationSpeed
	);
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

	const presetSizes = [
		{ name: "Small", width: 15, height: 15 },
		{ name: "Medium", width: 25, height: 25 },
		{ name: "Large", width: 35, height: 35 },
		{ name: "Max", width: 50, height: 50 },
	];

	const getGridCellSize = (): {
		cellSize: number;
		gridStyle: React.CSSProperties;
	} => {
		const screenWidth = windowSize.width || 1024;
		const screenHeight = windowSize.height || 768;

		// Reserve space for sidebar (280px on large screens, minimal on mobile)
		const sidebarWidth = screenWidth >= 1024 ? 280 : 0;
		// Reserve space for padding, headers, and other elements
		const reservedWidth = sidebarWidth + 120;
		const reservedHeight = 250;

		const availableWidth = screenWidth - reservedWidth;
		const availableHeight = screenHeight - reservedHeight;

		// Calculate max cell size that fits both dimensions
		const maxCellWidth = Math.floor(availableWidth / width);
		const maxCellHeight = Math.floor(availableHeight / height);
		const optimalSize = Math.min(maxCellWidth, maxCellHeight);

		// Clamp between reasonable bounds (minimum 10px, maximum 30px for config)
		const cellSize = Math.max(10, Math.min(30, optimalSize));

		return {
			cellSize,
			gridStyle: {
				maxWidth: `${width * cellSize + 4}px`,
				maxHeight: `${height * cellSize + 4}px`,
			},
		};
	};

	const handlePresetSize = (preset: { width: number; height: number }) => {
		setWidth(preset.width);
		setHeight(preset.height);
		setStartX(0);
		setStartY(0);
		setEndX(preset.width - 1);
		setEndY(preset.height - 1);
	};

	const handleGenerate = () => {
		const finalWidth = Math.max(5, Math.min(50, width));
		const finalHeight = Math.max(5, Math.min(50, height));

		// Ensure start position is on edge
		let finalStartX = Math.max(0, Math.min(finalWidth - 1, startX));
		let finalStartY = Math.max(0, Math.min(finalHeight - 1, startY));

		const isStartOnEdge =
			finalStartX === 0 ||
			finalStartX === finalWidth - 1 ||
			finalStartY === 0 ||
			finalStartY === finalHeight - 1;

		if (!isStartOnEdge) {
			// Default to top-left corner if start position is not on edge
			finalStartX = 0;
			finalStartY = 0;
		}

		const newConfig: MazeConfig = {
			width: finalWidth,
			height: finalHeight,
			startX: finalStartX,
			startY: finalStartY,
			endX: Math.max(0, Math.min(finalWidth - 1, endX)),
			endY: Math.max(0, Math.min(finalHeight - 1, endY)),
			generationSpeed,
		};

		onConfigComplete(newConfig);
	};

	return (
		<div className="w-full h-full flex flex-col lg:flex-row overflow-hidden gap-3 sm:gap-4 p-2 sm:p-4 bg-background">
			<h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 text-center lg:hidden">
				Configure Your Maze
			</h2>

			{/* Position Configuration - Left Side */}
			<div className="flex-1 flex justify-center items-center min-h-0 order-2 lg:order-1">
				<div className="flex justify-center">
					<div
						className="inline-block border-2 border-foreground bg-background flex-shrink-0 select-none"
						style={{
							...getGridCellSize().gridStyle,
							touchAction: "none",
							userSelect: "none",
						}}
					>
						{Array.from({ length: height }, (_, y) => (
							<div key={y} className="flex">
								{Array.from({ length: width }, (_, x) => {
									const isStart = startX === x && startY === y;
									const isEnd = endX === x && endY === y;
									const isEdge =
										x === 0 || x === width - 1 || y === 0 || y === height - 1;
									const { cellSize } = getGridCellSize();

									// Create a cell object that matches the maze cell structure
									const cell = {
										x,
										y,
										visited: false,
										walls: { top: true, right: true, bottom: true, left: true },
										isStart,
										isEnd,
									};

									const cellClass =
										"cursor-pointer transition-colors duration-150 flex-shrink-0 relative";

									// Get base styling from shared function
									const cellStyle = getCellStyle(cell, {
										borderColor:
											isEdge && !isStart && !isEnd ? "#1f2937" : "#374151",
									});

									// Override background colors for non-start/end cells
									if (!isStart && !isEnd) {
										if (isEdge) {
											// Edge pieces: slightly lighter than unvisited for distinction
											cellStyle.backgroundColor = "#374151"; // Slightly lighter than unvisited
										} else {
											// Inner pieces: same as unvisited game cells
											cellStyle.backgroundColor = "#1f2937";
										}
									}

									return (
										<div
											key={`${x}-${y}`}
											className={cellClass}
											style={{
												...cellStyle,
												width: `${cellSize}px`,
												height: `${cellSize}px`,
												minWidth: `${cellSize}px`,
												minHeight: `${cellSize}px`,
											}}
											onClick={() => {
												if (isStart) {
													// Clear start selection if clicking on existing start
													setStartX(0);
													setStartY(0);
												} else if (isEnd) {
													// Clear end selection if clicking on existing end
													setEndX(width - 1);
													setEndY(height - 1);
												} else if (isEdge) {
													// Edge cells can be either start or end - prioritize start if none set
													if (
														startX === 0 &&
														startY === 0 &&
														!(x === 0 && y === 0)
													) {
														// Set as start if we're still at default start position
														setStartX(x);
														setStartY(y);
													} else {
														// Set as end position
														setEndX(x);
														setEndY(y);
													}
												} else {
													// Inner cells can only be end positions
													setEndX(x);
													setEndY(y);
												}
											}}
											title={
												isStart
													? `Start: (${x}, ${y}) - Click to clear`
													: isEnd
													? `End: (${x}, ${y}) - Click to clear`
													: isEdge
													? `Click to set start or end position at (${x}, ${y})`
													: `Click to set end position at (${x}, ${y})`
											}
										>
											{isStart && (
												<div className="absolute inset-0 flex items-center justify-center">
													<span className="text-white font-bold text-xs">
														S
													</span>
												</div>
											)}
											{isEnd && (
												<div className="absolute inset-0 flex items-center justify-center">
													<span className="text-white font-bold text-xs">
														E
													</span>
												</div>
											)}
										</div>
									);
								})}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Configuration Options - Right Side */}
			<div className="w-full lg:w-64 xl:w-72 flex-shrink-0 bg-muted/30 rounded-lg p-3 sm:p-4 border border-border overflow-auto order-1 lg:order-2 max-h-64 lg:max-h-none">
				<div className="space-y-4 sm:space-y-6">
					<div className="hidden lg:block">
						<h2 className="text-xl font-bold text-foreground mb-4 text-center">
							Configure Your Maze
						</h2>
					</div>

					{/* Size Configuration */}
					<div className="bg-background p-4 rounded-lg border border-border">
						<h3 className="text-lg font-semibold text-foreground mb-4">
							Maze Size
						</h3>

						<div className="grid grid-cols-2 gap-2 mb-4">
							{presetSizes.map(preset => (
								<button
									key={preset.name}
									onClick={() => handlePresetSize(preset)}
									className={`px-3 py-2 rounded-md font-medium transition-colors text-sm w-full ${
										width === preset.width && height === preset.height
											? "bg-primary text-primary-foreground"
											: "bg-background text-foreground border border-border hover:bg-secondary"
									}`}
								>
									{preset.name}
								</button>
							))}
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Width
								</label>
								<input
									type="number"
									min="5"
									max="50"
									value={width}
									onChange={e => setWidth(parseInt(e.target.value) || 5)}
									className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground text-sm"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-foreground mb-2">
									Height
								</label>
								<input
									type="number"
									min="5"
									max="50"
									value={height}
									onChange={e => setHeight(parseInt(e.target.value) || 5)}
									className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground text-sm"
								/>
							</div>
						</div>
					</div>

					{/* Generation Speed */}
					<div className="bg-background p-4 rounded-lg border border-border">
						<h3 className="text-lg font-semibold text-foreground mb-4">
							Generation Speed
						</h3>
						<div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
							<span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">
								Slow
							</span>
							<input
								type="range"
								min="10"
								max="200"
								value={210 - generationSpeed}
								onChange={e =>
									setGenerationSpeed(210 - parseInt(e.target.value))
								}
								className="flex-1 min-w-0 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
							/>
							<span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">
								Fast
							</span>
						</div>
						<p className="text-xs sm:text-sm text-muted-foreground mt-2">
							Current speed: {generationSpeed}ms delay
						</p>
					</div>

					{/* Position Selection Info */}
					<div className="bg-background p-4 rounded-lg border border-border">
						<h3 className="text-lg font-semibold text-foreground mb-3">
							Start & End Positions
						</h3>

						<div className="space-y-3">
							<div className="grid grid-cols-1 gap-3 text-sm">
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 bg-green-500 rounded border border-border flex-shrink-0"></div>
									<span className="text-foreground">
										Start Position (must be on outer edge)
									</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 bg-red-500 rounded border border-border flex-shrink-0"></div>
									<span className="text-foreground">
										End Position (can be anywhere)
									</span>
								</div>
							</div>

							<div className="text-center text-sm text-muted-foreground p-2 bg-muted/50 rounded">
								<p className="font-medium">Current Selection:</p>
								<p>
									Start: ({startX}, {startY}) → End: ({endX}, {endY})
								</p>
							</div>

							<div className="text-xs text-muted-foreground">
								<p>
									Click on the grid to set positions. Start must be on the outer
									edge, end can be placed anywhere including edges.
								</p>
							</div>
						</div>
					</div>

					{/* Generate Button */}
					<div className="text-center">
						<button
							onClick={handleGenerate}
							className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
						>
							Generate Maze
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ConfigScreen;
