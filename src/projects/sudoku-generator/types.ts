export interface SudokuCell {
  value: number;
  isGiven: boolean;
  pencilMarks: Set<number>;
  x: number;
  y: number;
  isSelected: boolean;
  isHighlighted: boolean;
  hasError: boolean;
}

export interface SudokuConfig {
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'custom';
  clues: number;
  generationSpeed: number;
}

export interface Position {
  x: number;
  y: number;
}

export type GameState = 
  | 'title'
  | 'config'
  | 'generating'
  | 'manual-solving'
  | 'auto-solving'
  | 'victory';

export type SolvingAlgorithm = 'logical' | 'backtracking';

export type InputMode = 'pen' | 'pencil';

export interface SudokuGrid {
  cells: SudokuCell[][];
  originalGrid: number[][];
  solutionGrid: number[][];
}

export interface SolverStep {
  type: 'placement' | 'elimination' | 'backtrack' | 'trial';
  position: Position;
  value?: number;
  eliminatedValues?: number[];
  reason?: string;
}