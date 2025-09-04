import { SudokuCell, SolverStep } from "../types";
import { isValidCellPlacement, getPossibleValues } from "./validation";
import { delay } from "./common";

// Logical solving algorithms
export class LogicalSolver {
	private grid: SudokuCell[][];

	constructor(grid: SudokuCell[][]) {
		this.grid = grid.map(row => row.map(cell => ({...cell})));
	}

	// Main logical solving method
	public solve(
		onStep: (grid: SudokuCell[][], step: SolverStep) => void,
		speed: number,
		onComplete: () => void
	): void {
		this.solveStep(onStep, speed, onComplete);
	}

	private async solveStep(
		onStep: (grid: SudokuCell[][], step: SolverStep) => void,
		speed: number,
		onComplete: () => void
	): Promise<void> {
		let progress = true;

		while (progress && !this.isSolved()) {
			progress = false;

			// Try naked singles
			const nakedSingle = this.findNakedSingle();
			if (nakedSingle) {
				this.grid[nakedSingle.position.y][nakedSingle.position.x].value = nakedSingle.value!;
				this.grid[nakedSingle.position.y][nakedSingle.position.x].isHighlighted = true;
				
				onStep([...this.grid.map(row => [...row])], nakedSingle);
				await delay(speed);
				
				this.grid[nakedSingle.position.y][nakedSingle.position.x].isHighlighted = false;
				progress = true;
				continue;
			}

			// Try hidden singles
			const hiddenSingle = this.findHiddenSingle();
			if (hiddenSingle) {
				this.grid[hiddenSingle.position.y][hiddenSingle.position.x].value = hiddenSingle.value!;
				this.grid[hiddenSingle.position.y][hiddenSingle.position.x].isHighlighted = true;
				
				onStep([...this.grid.map(row => [...row])], hiddenSingle);
				await delay(speed);
				
				this.grid[hiddenSingle.position.y][hiddenSingle.position.x].isHighlighted = false;
				progress = true;
				continue;
			}

			// Try constraint propagation
			const elimination = this.eliminateImpossibles();
			if (elimination) {
				onStep([...this.grid.map(row => [...row])], elimination);
				await delay(speed / 2);
				progress = true;
				continue;
			}
		}

		if (!this.isSolved()) {
			// If logical methods fail, fall back to backtracking
			const backtrackingSolver = new BacktrackingSolver(this.grid);
			backtrackingSolver.solve(onStep, speed, onComplete);
		} else {
			onComplete();
		}
	}

	private findNakedSingle(): SolverStep | null {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				if (this.grid[row][col].value === 0) {
					const possibles = this.getPossibleValues(row, col);
					if (possibles.length === 1) {
						return {
							type: 'placement',
							position: { x: col, y: row },
							value: possibles[0],
							reason: 'Naked Single - only one possible value'
						};
					}
				}
			}
		}
		return null;
	}

	private findHiddenSingle(): SolverStep | null {
		// Check rows
		for (let row = 0; row < 9; row++) {
			for (let num = 1; num <= 9; num++) {
				const possibleCols = [];
				for (let col = 0; col < 9; col++) {
					if (this.grid[row][col].value === 0 && this.isValid(row, col, num)) {
						possibleCols.push(col);
					}
				}
				if (possibleCols.length === 1) {
					return {
						type: 'placement',
						position: { x: possibleCols[0], y: row },
						value: num,
						reason: 'Hidden Single - only cell in row for this number'
					};
				}
			}
		}

		// Check columns
		for (let col = 0; col < 9; col++) {
			for (let num = 1; num <= 9; num++) {
				const possibleRows = [];
				for (let row = 0; row < 9; row++) {
					if (this.grid[row][col].value === 0 && this.isValid(row, col, num)) {
						possibleRows.push(row);
					}
				}
				if (possibleRows.length === 1) {
					return {
						type: 'placement',
						position: { x: col, y: possibleRows[0] },
						value: num,
						reason: 'Hidden Single - only cell in column for this number'
					};
				}
			}
		}

		// Check boxes
		for (let boxRow = 0; boxRow < 3; boxRow++) {
			for (let boxCol = 0; boxCol < 3; boxCol++) {
				for (let num = 1; num <= 9; num++) {
					const possibleCells = [];
					for (let i = 0; i < 3; i++) {
						for (let j = 0; j < 3; j++) {
							const row = boxRow * 3 + i;
							const col = boxCol * 3 + j;
							if (this.grid[row][col].value === 0 && this.isValid(row, col, num)) {
								possibleCells.push({ x: col, y: row });
							}
						}
					}
					if (possibleCells.length === 1) {
						return {
							type: 'placement',
							position: possibleCells[0],
							value: num,
							reason: 'Hidden Single - only cell in box for this number'
						};
					}
				}
			}
		}

		return null;
	}

	private eliminateImpossibles(): SolverStep | null {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				if (this.grid[row][col].value === 0) {
					const possibles = this.getPossibleValues(row, col);
					const currentMarks = Array.from(this.grid[row][col].pencilMarks);
					const eliminated = currentMarks.filter(num => !possibles.includes(num));
					
					if (eliminated.length > 0) {
						eliminated.forEach(num => this.grid[row][col].pencilMarks.delete(num));
						this.grid[row][col].isHighlighted = true;
						
						return {
							type: 'elimination',
							position: { x: col, y: row },
							eliminatedValues: eliminated,
							reason: 'Constraint Propagation - eliminated impossible values'
						};
					}
				}
			}
		}
		return null;
	}

	private getPossibleValues(row: number, col: number): number[] {
		return getPossibleValues(this.grid, row, col);
	}

	private isValid(row: number, col: number, num: number): boolean {
		return isValidCellPlacement(this.grid, row, col, num);
	}

	private isSolved(): boolean {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				if (this.grid[row][col].value === 0) return false;
			}
		}
		return true;
	}

}

// Backtracking solver with visualization
export class BacktrackingSolver {
	private grid: SudokuCell[][];

	constructor(grid: SudokuCell[][]) {
		this.grid = grid.map(row => row.map(cell => ({...cell})));
	}

	public solve(
		onStep: (grid: SudokuCell[][], step: SolverStep) => void,
		speed: number,
		onComplete: () => void
	): void {
		this.backtrack(0, 0, onStep, speed, onComplete);
	}

	private async backtrack(
		row: number,
		col: number,
		onStep: (grid: SudokuCell[][], step: SolverStep) => void,
		speed: number,
		onComplete: () => void
	): Promise<boolean> {
		// Find next empty cell
		let currentRow = row;
		let currentCol = col;
		
		while (currentRow < 9) {
			while (currentCol < 9 && this.grid[currentRow][currentCol].value !== 0) {
				currentCol++;
			}
			if (currentCol < 9) break;
			currentRow++;
			currentCol = 0;
		}

		// If no empty cell found, puzzle is solved
		if (currentRow === 9) {
			onComplete();
			return true;
		}

		// Clear all highlights except current cell
		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
				this.grid[r][c].isHighlighted = false;
			}
		}

		// Try numbers 1-9
		for (let num = 1; num <= 9; num++) {
			if (this.isValid(currentRow, currentCol, num)) {
				// Place number and highlight only current cell
				this.grid[currentRow][currentCol].value = num;
				this.grid[currentRow][currentCol].isHighlighted = true;
				
				const step: SolverStep = {
					type: 'trial',
					position: { x: currentCol, y: currentRow },
					value: num,
					reason: `Trying ${num} at (${currentCol + 1}, ${currentRow + 1})`
				};

				onStep([...this.grid.map(row => [...row])], step);
				await delay(speed);

				// Clear highlight before recursing
				this.grid[currentRow][currentCol].isHighlighted = false;

				// Recursively solve
				if (await this.backtrack(currentRow, currentCol + 1, onStep, speed, onComplete)) {
					return true;
				}

				// Backtrack - remove the number but show it was visited
				this.grid[currentRow][currentCol].value = 0;
				this.grid[currentRow][currentCol].hasError = true;

				const backtrackStep: SolverStep = {
					type: 'backtrack',
					position: { x: currentCol, y: currentRow },
					reason: `Backtracking from (${currentCol + 1}, ${currentRow + 1})`
				};

				onStep([...this.grid.map(row => [...row])], backtrackStep);
				await delay(speed / 2);

				this.grid[currentRow][currentCol].hasError = false;
			}
		}

		return false;
	}

	private isValid(row: number, col: number, num: number): boolean {
		return isValidCellPlacement(this.grid, row, col, num);
	}

}