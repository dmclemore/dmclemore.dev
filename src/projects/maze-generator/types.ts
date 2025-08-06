export interface Cell {
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
  isPath?: boolean;
  isExplored?: boolean;
  isSolution?: boolean;
}

export interface MazeConfig {
  width: number;
  height: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
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

export type Algorithm = 'astar' | 'bfs';

export interface PathfindingNode {
  x: number;
  y: number;
  gCost: number;
  hCost: number;
  fCost: number;
  parent: PathfindingNode | null;
}