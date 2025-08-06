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

	const generateRandomPositions = useCallback(() => {
		// Generate random start position on edge
		const edges = [];
		for (let x = 0; x < MAZE_SIZE; x++) {
			edges.push({ x, y: 0 }); // top edge
			edges.push({ x, y: MAZE_SIZE - 1 }); // bottom edge
		}
		for (let y = 1; y < MAZE_SIZE - 1; y++) {
			edges.push({ x: 0, y }); // left edge
			edges.push({ x: MAZE_SIZE - 1, y }); // right edge
		}
		const startPos = edges[Math.floor(Math.random() * edges.length)];

		// Generate random end position anywhere
		const endPos = {
			x: Math.floor(Math.random() * MAZE_SIZE),
			y: Math.floor(Math.random() * MAZE_SIZE),
		};

		return { startPos, endPos };
	}, []);

	const initializeMaze = useCallback(
		(
			startPos: { x: number; y: number },
			endPos: { x: number; y: number }
		): Cell[][] => {
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
						isStart: x === startPos.x && y === startPos.y,
						isEnd: x === endPos.x && y === endPos.y,
					};
				}
			}
			return newMaze;
		},
		[]
	);

	const startMazeGeneration = useCallback(() => {
		if (isGenerating) return;

		setIsGenerating(true);
		setShouldRestart(false);

		// Generate random start and end positions
		const { startPos, endPos } = generateRandomPositions();

		generateMaze(
			MAZE_SIZE,
			MAZE_SIZE,
			startPos.x,
			startPos.y,
			endPos.x,
			endPos.y,
			GENERATION_SPEED,
			setMaze,
			() => {
				setIsGenerating(false);
				// Set flag to restart after a delay
				setTimeout(() => setShouldRestart(true), 1000);
			}
		);
	}, [isGenerating, generateRandomPositions]);

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
