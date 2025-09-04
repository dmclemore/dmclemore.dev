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