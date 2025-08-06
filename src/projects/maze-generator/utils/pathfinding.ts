import { Cell, Position, PathfindingNode } from "../types";

export const reconstructPath = (
	node: PathfindingNode,
	maze: Cell[][],
	onComplete: () => void,
	speed: number,
	setMaze: (maze: Cell[][]) => void,
	getCurrentMaze?: () => Cell[][]
): void => {
	const path: Position[] = [];
	let current: PathfindingNode | null = node;

	while (current) {
		path.unshift({ x: current.x, y: current.y });
		current = current.parent;
	}

	// Retrieve the current maze state by calling getCurrentMaze if provided, otherwise use the maze parameter
	const mazeWithExplored = getCurrentMaze ? getCurrentMaze() : maze;

	// Animate the solution path step by step
	let pathIndex = 0;
	const animateSolution = (): void => {
		if (pathIndex >= path.length) {
			// Animation complete, wait a bit then finish
			setTimeout(() => {
				onComplete();
			}, 1000);
			return;
		}

		const currentPos = path[pathIndex];
		const newMaze = mazeWithExplored.map(row =>
			row.map(cell => {
				// Preserve explored state and add solution markers progressively
				const isSolution = path
					.slice(0, pathIndex + 1)
					.some(pos => pos.x === cell.x && pos.y === cell.y);
				return {
					...cell,
					isSolution,
					// Keep the existing isExplored state from the captured maze
				};
			})
		);

		setMaze(newMaze);
		pathIndex++;
		setTimeout(animateSolution, speed * 2); // Slower animation for solution path
	};

	// Start solution animation after a brief pause
	setTimeout(animateSolution, 500);
};

export const solveMazeAStar = (
	maze: Cell[][],
	start: Position,
	end: Position,
	speed: number,
	setMaze: (maze: Cell[][]) => void,
	onComplete: () => void,
	onSolutionFound?: () => void,
	getCurrentMaze?: () => Cell[][]
): void => {
	const openSet: PathfindingNode[] = [];
	const closedSet: Set<string> = new Set();

	const startNode: PathfindingNode = {
		x: start.x,
		y: start.y,
		gCost: 0,
		hCost: Math.abs(start.x - end.x) + Math.abs(start.y - end.y),
		fCost: 0,
		parent: null,
	};
	startNode.fCost = startNode.gCost + startNode.hCost;

	openSet.push(startNode);

	const getKey = (x: number, y: number): string => `${x},${y}`;

	const getNeighbors = (node: PathfindingNode): PathfindingNode[] => {
		const neighbors: PathfindingNode[] = [];
		const { x, y } = node;
		const cell = maze[y][x];

		if (!cell.walls.top && y > 0) {
			neighbors.push({
				x,
				y: y - 1,
				gCost: node.gCost + 1,
				hCost: Math.abs(x - end.x) + Math.abs(y - 1 - end.y),
				fCost: 0,
				parent: node,
			});
		}

		if (!cell.walls.right && x < maze[0].length - 1) {
			neighbors.push({
				x: x + 1,
				y,
				gCost: node.gCost + 1,
				hCost: Math.abs(x + 1 - end.x) + Math.abs(y - end.y),
				fCost: 0,
				parent: node,
			});
		}

		if (!cell.walls.bottom && y < maze.length - 1) {
			neighbors.push({
				x,
				y: y + 1,
				gCost: node.gCost + 1,
				hCost: Math.abs(x - end.x) + Math.abs(y + 1 - end.y),
				fCost: 0,
				parent: node,
			});
		}

		if (!cell.walls.left && x > 0) {
			neighbors.push({
				x: x - 1,
				y,
				gCost: node.gCost + 1,
				hCost: Math.abs(x - 1 - end.x) + Math.abs(y - end.y),
				fCost: 0,
				parent: node,
			});
		}

		neighbors.forEach(neighbor => {
			neighbor.fCost = neighbor.gCost + neighbor.hCost;
		});

		return neighbors;
	};

	const solveStep = (): void => {
		if (openSet.length === 0) {
			onComplete();
			return;
		}

		openSet.sort((a, b) => a.fCost - b.fCost);
		const current = openSet.shift()!;
		const currentKey = getKey(current.x, current.y);

		if (closedSet.has(currentKey)) {
			setTimeout(solveStep, speed);
			return;
		}

		closedSet.add(currentKey);

		if (current.x === end.x && current.y === end.y) {
			if (onSolutionFound) {
				onSolutionFound();
			}
			reconstructPath(
				current,
				maze,
				onComplete,
				speed,
				setMaze,
				getCurrentMaze
			);
			return;
		}

		const neighbors = getNeighbors(current);

		for (const neighbor of neighbors) {
			const neighborKey = getKey(neighbor.x, neighbor.y);

			if (closedSet.has(neighborKey)) continue;

			const existingNode = openSet.find(
				node => node.x === neighbor.x && node.y === neighbor.y
			);

			if (!existingNode) {
				openSet.push(neighbor);
			} else if (neighbor.gCost < existingNode.gCost) {
				existingNode.gCost = neighbor.gCost;
				existingNode.fCost = neighbor.fCost;
				existingNode.parent = neighbor.parent;
			}
		}

		const newMaze = maze.map(row =>
			row.map(cell => ({
				...cell,
				isExplored:
					closedSet.has(getKey(cell.x, cell.y)) ||
					openSet.some(node => node.x === cell.x && node.y === cell.y),
			}))
		);

		setMaze(newMaze);
		setTimeout(solveStep, speed);
	};

	setTimeout(solveStep, speed);
};

export const solveMazeBFS = (
	maze: Cell[][],
	start: Position,
	end: Position,
	speed: number,
	setMaze: (maze: Cell[][]) => void,
	onComplete: () => void,
	onSolutionFound?: () => void,
	getCurrentMaze?: () => Cell[][]
): void => {
	const queue: PathfindingNode[] = [];
	const visited: Set<string> = new Set();

	const startNode: PathfindingNode = {
		x: start.x,
		y: start.y,
		gCost: 0,
		hCost: 0,
		fCost: 0,
		parent: null,
	};

	queue.push(startNode);
	visited.add(`${start.x},${start.y}`);

	const getKey = (x: number, y: number): string => `${x},${y}`;

	const getNeighbors = (node: PathfindingNode): PathfindingNode[] => {
		const neighbors: PathfindingNode[] = [];
		const { x, y } = node;
		const cell = maze[y][x];

		if (!cell.walls.top && y > 0) {
			neighbors.push({
				x,
				y: y - 1,
				gCost: node.gCost + 1,
				hCost: 0,
				fCost: 0,
				parent: node,
			});
		}

		if (!cell.walls.right && x < maze[0].length - 1) {
			neighbors.push({
				x: x + 1,
				y,
				gCost: node.gCost + 1,
				hCost: 0,
				fCost: 0,
				parent: node,
			});
		}

		if (!cell.walls.bottom && y < maze.length - 1) {
			neighbors.push({
				x,
				y: y + 1,
				gCost: node.gCost + 1,
				hCost: 0,
				fCost: 0,
				parent: node,
			});
		}

		if (!cell.walls.left && x > 0) {
			neighbors.push({
				x: x - 1,
				y,
				gCost: node.gCost + 1,
				hCost: 0,
				fCost: 0,
				parent: node,
			});
		}

		return neighbors;
	};

	const solveStep = (): void => {
		if (queue.length === 0) {
			onComplete();
			return;
		}

		const current = queue.shift()!;

		if (current.x === end.x && current.y === end.y) {
			if (onSolutionFound) {
				onSolutionFound();
			}
			reconstructPath(
				current,
				maze,
				onComplete,
				speed,
				setMaze,
				getCurrentMaze
			);
			return;
		}

		const neighbors = getNeighbors(current);

		for (const neighbor of neighbors) {
			const neighborKey = getKey(neighbor.x, neighbor.y);

			if (!visited.has(neighborKey)) {
				visited.add(neighborKey);
				queue.push(neighbor);
			}
		}

		const newMaze = maze.map(row =>
			row.map(cell => ({
				...cell,
				isExplored: visited.has(getKey(cell.x, cell.y)),
			}))
		);

		setMaze(newMaze);
		setTimeout(solveStep, speed);
	};

	setTimeout(solveStep, speed);
};
