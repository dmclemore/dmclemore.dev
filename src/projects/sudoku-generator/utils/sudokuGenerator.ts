import { SudokuCell, SudokuGrid } from "../types";
import { isValidPlacement } from "./validation";
import { convertToSudokuCells, shuffleArray } from "./common";

export const generateSudoku = (
	clues: number,
	speed: number,
	onStep: (grid: SudokuCell[][]) => void,
	onComplete: (grid: SudokuGrid) => void
): void => {
	// Initialize empty 9x9 grid
	const createEmptyGrid = (): number[][] => {
		return Array(9).fill(null).map(() => Array(9).fill(0));
	};


	// Fill diagonal 3x3 boxes first (no conflicts possible)
	const fillDiagonalBoxes = (grid: number[][]): void => {
		for (let box = 0; box < 9; box += 3) {
			const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
			
			let numIndex = 0;
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					grid[box + i][box + j] = nums[numIndex++];
				}
			}
		}
	};

	// Solve the grid using backtracking
	const solveGrid = (grid: number[][]): boolean => {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				if (grid[row][col] === 0) {
					// Try numbers 1-9 in random order for more variation
					const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

					for (const num of nums) {
						if (isValidPlacement(grid, row, col, num)) {
							grid[row][col] = num;
							if (solveGrid(grid)) {
								return true;
							}
							grid[row][col] = 0;
						}
					}
					return false;
				}
			}
		}
		return true;
	};

	// Count solutions (for validation)
	const countSolutions = (grid: number[][], count = 0): number => {
		if (count > 1) return count; // Early termination if more than 1 solution

		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				if (grid[row][col] === 0) {
					for (let num = 1; num <= 9; num++) {
						if (isValidPlacement(grid, row, col, num)) {
							grid[row][col] = num;
							count = countSolutions(grid, count);
							grid[row][col] = 0;
						}
					}
					return count;
				}
			}
		}
		return count + 1;
	};

	// Remove numbers to create puzzle
	const removeNumbers = async (grid: number[][], targetClues: number): Promise<number[][]> => {
		const puzzle = grid.map(row => [...row]);
		const positions: [number, number][] = [];
		
		// Generate all positions
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				positions.push([row, col]);
			}
		}

		// Shuffle positions
		const shuffledPositions = shuffleArray(positions);

		let removedCount = 0;
		const maxToRemove = 81 - targetClues;
		
		for (const [row, col] of shuffledPositions) {
			if (removedCount >= maxToRemove) break;

			const backup = puzzle[row][col];
			puzzle[row][col] = 0;

			// Check if puzzle still has unique solution
			const testGrid = puzzle.map(r => [...r]);
			const solutions = countSolutions(testGrid);
			
			if (solutions === 1) {
				removedCount++;
				// Update visual representation
				await new Promise(resolve => {
					setTimeout(() => {
						onStep(convertToSudokuCells(puzzle));
						resolve(void 0);
					}, speed);
				});
			} else {
				// Restore if multiple solutions
				puzzle[row][col] = backup;
			}
		}

		return puzzle;
	};

	// Main generation process
	const generateStep = async (): Promise<void> => {
		try {
			// Step 1: Create empty grid and fill diagonal boxes
			const grid = createEmptyGrid();
			fillDiagonalBoxes(grid);
			
			// Show initial diagonal boxes
			onStep(convertToSudokuCells(grid));
			await new Promise(resolve => setTimeout(resolve, speed * 2));

			// Step 2: Fill remaining cells
			solveGrid(grid);
			
			// Show complete grid
			onStep(convertToSudokuCells(grid));
			await new Promise(resolve => setTimeout(resolve, speed * 2));

			// Step 3: Remove numbers to create puzzle
			const solutionGrid = grid.map(row => [...row]);
			const puzzleGrid = await removeNumbers(grid, clues);
			
			// Create final SudokuGrid object
			const finalGrid: SudokuGrid = {
				cells: convertToSudokuCells(puzzleGrid),
				originalGrid: puzzleGrid.map(row => [...row]),
				solutionGrid: solutionGrid,
			};

			onComplete(finalGrid);
		} catch (error) {
			console.error('Error generating sudoku:', error);
			// Fallback - generate simpler puzzle
			setTimeout(() => generateStep(), 100);
		}
	};

	// Start generation
	setTimeout(generateStep, speed);
};

// Helper function to validate a complete sudoku solution
export const isValidSudoku = (grid: number[][]): boolean => {
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			const num = grid[row][col];
			if (num === 0) return false;
			
			// Temporarily remove the number to check validity
			grid[row][col] = 0;
			const valid = isValidPlacement(grid, row, col, num);
			grid[row][col] = num;
			
			if (!valid) return false;
		}
	}
	return true;
};

// Export shared validation function for backwards compatibility
export { getPossibleValues } from './validation';

