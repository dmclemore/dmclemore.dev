import { Cell } from "../types";

export const generateMaze = (
	width: number,
	height: number,
	startX: number,
	startY: number,
	endX: number,
	endY: number,
	speed: number,
	setMaze: (maze: Cell[][]) => void,
	onComplete: () => void
): void => {
	const maze: Cell[][] = [];

	for (let y = 0; y < height; y++) {
		maze[y] = [];
		for (let x = 0; x < width; x++) {
			maze[y][x] = {
				x,
				y,
				visited: false,
				walls: {
					top: true,
					right: true,
					bottom: true,
					left: true,
				},
				isStart: x === startX && y === startY,
				isEnd: x === endX && y === endY,
			};
		}
	}

	const stack: Cell[] = [];
	const current = maze[startY][startX];
	current.visited = true;
	stack.push(current);

	const getNeighbors = (cell: Cell): Cell[] => {
		const neighbors: Cell[] = [];
		const { x, y } = cell;

		if (y > 0 && !maze[y - 1][x].visited) neighbors.push(maze[y - 1][x]);
		if (x < width - 1 && !maze[y][x + 1].visited)
			neighbors.push(maze[y][x + 1]);
		if (y < height - 1 && !maze[y + 1][x].visited)
			neighbors.push(maze[y + 1][x]);
		if (x > 0 && !maze[y][x - 1].visited) neighbors.push(maze[y][x - 1]);

		return neighbors;
	};

	const countOpenWalls = (cell: Cell): number => {
		let openCount = 0;
		if (!cell.walls.top) openCount++;
		if (!cell.walls.right) openCount++;
		if (!cell.walls.bottom) openCount++;
		if (!cell.walls.left) openCount++;
		return openCount;
	};

	const wouldViolateStartEndRule = (current: Cell, next: Cell): boolean => {
		// Check if removing this wall would give start or end cell more than 1 opening
		const isCurrentStartOrEnd = current.isStart || current.isEnd;
		const isNextStartOrEnd = next.isStart || next.isEnd;
		
		if (isCurrentStartOrEnd && countOpenWalls(current) >= 1) {
			return true; // Current start/end already has an opening
		}
		if (isNextStartOrEnd && countOpenWalls(next) >= 1) {
			return true; // Next start/end already has an opening
		}
		
		return false;
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


	const generateStep = (): void => {
		if (stack.length === 0) {
			onComplete();
			return;
		}

		const current = stack[stack.length - 1];
		const neighbors = getNeighbors(current);

		if (neighbors.length > 0) {
			// Filter neighbors to respect start/end wall constraints
			const validNeighbors = neighbors.filter(next => !wouldViolateStartEndRule(current, next));
			
			if (validNeighbors.length > 0) {
				const next = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
				next.visited = true;
				removeWall(current, next);
				stack.push(next);
			} else {
				// No valid neighbors due to constraints, backtrack
				stack.pop();
			}
		} else {
			stack.pop();
		}

		setMaze([...maze]);
		setTimeout(generateStep, speed);
	};

	setMaze([...maze]);
	setTimeout(generateStep, speed);
};
