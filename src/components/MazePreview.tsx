"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Play } from "lucide-react";

interface Cell {
	x: number;
	y: number;
	visited: boolean;
	walls: {
		top: boolean;
		right: boolean;
		bottom: boolean;
		left: boolean;
	};
	isStart?: boolean;
	isEnd?: boolean;
}

const MazePreview: React.FC = () => {
	const [maze, setMaze] = useState<Cell[][]>([]);
	const [isGenerating, setIsGenerating] = useState(false);

	const MAZE_SIZE = 25;
	const GENERATION_SPEED = 25;

	const initializeMaze = useCallback((): Cell[][] => {
		const newMaze: Cell[][] = [];
		for (let y = 0; y < MAZE_SIZE; y++) {
			newMaze[y] = [];
			for (let x = 0; x < MAZE_SIZE; x++) {
				newMaze[y][x] = {
					x,
					y,
					visited: false,
					walls: {
						top: true,
						right: true,
						bottom: true,
						left: true,
					},
					isStart: x === 0 && y === 0,
					isEnd: x === MAZE_SIZE - 1 && y === MAZE_SIZE - 1,
				};
			}
		}
		return newMaze;
	}, []);

	const generateMaze = useCallback(async () => {
		if (isGenerating) return;

		setIsGenerating(true);
		const newMaze = initializeMaze();
		setMaze([...newMaze]);

		const stack: Cell[] = [];
		const current = newMaze[0][0];
		current.visited = true;
		stack.push(current);

		const getNeighbors = (cell: Cell): Cell[] => {
			const neighbors: Cell[] = [];
			const { x, y } = cell;

			if (y > 0 && !newMaze[y - 1][x].visited)
				neighbors.push(newMaze[y - 1][x]);
			if (x < MAZE_SIZE - 1 && !newMaze[y][x + 1].visited)
				neighbors.push(newMaze[y][x + 1]);
			if (y < MAZE_SIZE - 1 && !newMaze[y + 1][x].visited)
				neighbors.push(newMaze[y + 1][x]);
			if (x > 0 && !newMaze[y][x - 1].visited)
				neighbors.push(newMaze[y][x - 1]);

			return neighbors;
		};

		const removeWall = (current: Cell, next: Cell): void => {
			const dx = current.x - next.x;
			const dy = current.y - next.y;

			if (dx === 1) {
				current.walls.left = false;
				next.walls.right = false;
			} else if (dx === -1) {
				current.walls.right = false;
				next.walls.left = false;
			} else if (dy === 1) {
				current.walls.top = false;
				next.walls.bottom = false;
			} else if (dy === -1) {
				current.walls.bottom = false;
				next.walls.top = false;
			}
		};

		const enforceStartEndWalls = (): void => {
			// Ensure start and end have 3 walls and only one opening
			const startCell = newMaze[0][0];
			const endCell = newMaze[MAZE_SIZE - 1][MAZE_SIZE - 1];

			const enforceThreeWalls = (cell: Cell): void => {
				const directions: string[] = [];
				if (!cell.walls.top) directions.push("top");
				if (!cell.walls.right) directions.push("right");
				if (!cell.walls.bottom) directions.push("bottom");
				if (!cell.walls.left) directions.push("left");

				if (directions.length <= 1) return;

				const keepDirection =
					directions[Math.floor(Math.random() * directions.length)];

				directions.forEach(direction => {
					if (direction !== keepDirection) {
						if (direction === "top") {
							cell.walls.top = true;
							if (cell.y > 0) newMaze[cell.y - 1][cell.x].walls.bottom = true;
						} else if (direction === "right") {
							cell.walls.right = true;
							if (cell.x < MAZE_SIZE - 1)
								newMaze[cell.y][cell.x + 1].walls.left = true;
						} else if (direction === "bottom") {
							cell.walls.bottom = true;
							if (cell.y < MAZE_SIZE - 1)
								newMaze[cell.y + 1][cell.x].walls.top = true;
						} else if (direction === "left") {
							cell.walls.left = true;
							if (cell.x > 0) newMaze[cell.y][cell.x - 1].walls.right = true;
						}
					}
				});
			};

			enforceThreeWalls(startCell);
			enforceThreeWalls(endCell);
		};

		const generateStep = (): Promise<void> => {
			return new Promise(resolve => {
				if (stack.length === 0) {
					// Apply start/end wall enforcement
					enforceStartEndWalls();
					setMaze([...newMaze]);
					setIsGenerating(false);

					// Wait a bit then restart with fresh maze
					setTimeout(() => {
						generateMaze();
					}, 2000);
					resolve();
					return;
				}

				const current = stack[stack.length - 1];
				const neighbors = getNeighbors(current);

				if (neighbors.length > 0) {
					const next = neighbors[Math.floor(Math.random() * neighbors.length)];
					next.visited = true;
					removeWall(current, next);
					stack.push(next);
				} else {
					stack.pop();
				}

				setMaze([...newMaze]);
				setTimeout(() => resolve(), GENERATION_SPEED);
			});
		};

		// Generate maze step by step
		while (stack.length > 0) {
			await generateStep();
		}
	}, [initializeMaze, isGenerating]);

	useEffect(() => {
		generateMaze();
	}, [generateMaze]);

	const getCellStyle = (cell: Cell): React.CSSProperties => {
		const style: React.CSSProperties = {
			position: "relative",
			backgroundColor: cell.visited ? "#f3f4f6" : "#1f2937",
			transition: "background-color 0.2s ease",
		};

		const borderColor = "#374151";
		const borderWidth = "0.5px";

		if (cell.walls.top) {
			style.borderTop = `${borderWidth} solid ${borderColor}`;
		}
		if (cell.walls.right) {
			style.borderRight = `${borderWidth} solid ${borderColor}`;
		}
		if (cell.walls.bottom) {
			style.borderBottom = `${borderWidth} solid ${borderColor}`;
		}
		if (cell.walls.left) {
			style.borderLeft = `${borderWidth} solid ${borderColor}`;
		}

		if (cell.isStart) {
			style.backgroundColor = "#10b981";
		} else if (cell.isEnd) {
			style.backgroundColor = "#ef4444";
		}

		return style;
	};

	return (
		<div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden">
			{/* Animated maze grid */}
			<div className="absolute inset-0 p-2">
				<div className="w-full h-full grid grid-rows-25 grid-cols-25 gap-0">
					{maze.map((row, y) =>
						row.map((cell, x) => (
							<div
								key={`${x}-${y}`}
								style={getCellStyle(cell)}
								className="w-full h-full flex items-center justify-center relative"
							>
								{cell.isStart && (
									<span
										className="text-white font-bold"
										style={{ fontSize: "6px" }}
									>
										S
									</span>
								)}
								{cell.isEnd && (
									<span
										className="text-white font-bold"
										style={{ fontSize: "6px" }}
									>
										E
									</span>
								)}
							</div>
						))
					)}
				</div>
			</div>

			{/* Play overlay */}
			<div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
				<div className="bg-white/90 rounded-full p-4 shadow-lg">
					<Play className="h-8 w-8 text-gray-700 ml-1" />
				</div>
			</div>

			{/* Title overlay */}
			<div className="absolute bottom-4 left-4 right-4">
				<div className="bg-black/50 text-white px-3 py-2 rounded text-sm font-medium backdrop-blur-sm">
					{isGenerating ? "Generating Maze..." : "Maze Generation Preview"}
				</div>
			</div>

			{/* Generation indicator */}
			{isGenerating && (
				<div className="absolute top-4 right-4">
					<div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
				</div>
			)}
		</div>
	);
};

export default MazePreview;
