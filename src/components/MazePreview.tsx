"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Play } from "lucide-react";
import { getCellStyle } from "../projects/maze-generator/utils/mazeDisplay";
import { generateMaze } from "../projects/maze-generator/utils/mazeGenerator";

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
	const [shouldRestart, setShouldRestart] = useState(false);

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

	const startMazeGeneration = useCallback(() => {
		if (isGenerating) return;

		setIsGenerating(true);
		setShouldRestart(false);

		generateMaze(
			MAZE_SIZE,
			MAZE_SIZE,
			0, // startX
			0, // startY
			MAZE_SIZE - 1, // endX
			MAZE_SIZE - 1, // endY
			GENERATION_SPEED,
			setMaze,
			() => {
				setIsGenerating(false);
				// Set flag to restart after a delay
				setTimeout(() => setShouldRestart(true), 1000);
			}
		);
	}, [isGenerating]);

	// Handle initial start
	useEffect(() => {
		startMazeGeneration();
	}, []);

	// Handle restarts
	useEffect(() => {
		if (shouldRestart && !isGenerating) {
			startMazeGeneration();
		}
	}, [shouldRestart, isGenerating, startMazeGeneration]);

	return (
		<div className="relative w-full h-full bg-gradient-to-br from-muted to-secondary rounded-lg overflow-hidden">
			{/* Animated maze grid */}
			<div className="absolute inset-0 flex items-center justify-center">
				<div
					className="grid grid-rows-25 grid-cols-25 gap-0 bg-muted"
					style={{
						height: "100%",
						aspectRatio: "1",
					}}
				>
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
			<div className="absolute inset-0 bg-background/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
				<div className="bg-background/90 rounded-full p-4 shadow-lg">
					<Play className="h-8 w-8 text-foreground ml-1" />
				</div>
			</div>
		</div>
	);
};

export default MazePreview;
