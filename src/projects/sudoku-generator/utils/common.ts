import { SudokuCell } from "../types";

export const delay = (ms: number): Promise<void> => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

export const shuffleArray = <T>(array: T[]): T[] => {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
};

export const deepCloneGrid = (grid: SudokuCell[][]): SudokuCell[][] => {
	return grid.map(row => row.map(cell => ({...cell})));
};

// Proper seeded random number generator using Linear Congruential Generator
export class SeededRandom {
	private seed: number;

	constructor(seed: number) {
		this.seed = seed % 2147483647;
		if (this.seed <= 0) this.seed += 2147483646;
	}

	// Generate next random number between 0 and 1
	next(): number {
		this.seed = (this.seed * 16807) % 2147483647;
		return (this.seed - 1) / 2147483646;
	}

	// Generate random integer between min (inclusive) and max (exclusive)
	nextInt(min: number, max: number): number {
		return Math.floor(this.next() * (max - min)) + min;
	}

	// Shuffle array using Fisher-Yates with seeded randomness
	shuffle<T>(array: T[]): T[] {
		const shuffled = [...array];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = this.nextInt(0, i + 1);
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	}
}

export const convertToSudokuCells = (grid: number[][]): SudokuCell[][] => {
	return grid.map((row, y) =>
		row.map((value, x) => ({
			value,
			isGiven: value !== 0,
			pencilMarks: new Set<number>(),
			x,
			y,
			isSelected: false,
			isHighlighted: false,
			hasError: false,
		}))
	);
};