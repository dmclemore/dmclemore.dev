'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Cell, MazeConfig, GameState, Algorithm, Position } from './types';
import TitleScreen from './components/TitleScreen';
import ConfigScreen from './components/ConfigScreen';
import MazeDisplay from './components/MazeDisplay';
import VictoryScreen from './components/VictoryScreen';
import { generateMaze } from './utils/mazeGenerator';
import { solveMazeAStar, solveMazeBFS } from './utils/pathfinding';

const MazeGenerator: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('title');
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [config, setConfig] = useState<MazeConfig>({
    width: 15,
    height: 15,
    startX: 0,
    startY: 0,
    endX: 14,
    endY: 14,
    generationSpeed: 10,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [userPath, setUserPath] = useState<Position[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [solveStartTime, setSolveStartTime] = useState<number | null>(null);
  const [solveEndTime, setSolveEndTime] = useState<number | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>('astar');
  const [lastSolveMethod, setLastSolveMethod] = useState<'manual' | 'auto' | null>(null);
  const generationRef = useRef<number | null>(null);
  const solvingRef = useRef<number | null>(null);

  const handleStartGame = useCallback(() => {
    setGameState('config');
  }, []);

  const handleConfigComplete = useCallback((newConfig: MazeConfig) => {
    setConfig(newConfig);
    setGameState('generating');
    setIsGenerating(true);
    
    generateMaze(
      newConfig.width,
      newConfig.height,
      newConfig.startX,
      newConfig.startY,
      newConfig.endX,
      newConfig.endY,
      newConfig.generationSpeed,
      setMaze,
      () => {
        setIsGenerating(false);
        setGameState('manual-solving');
      }
    );
  }, []);

  const handleStartTimer = useCallback(() => {
    setSolveStartTime(Date.now());
    setUserPath([]);
  }, []);

  const handleClearBoard = useCallback(() => {
    setUserPath([]);
    setSolveStartTime(null);
    
    // Clear all paths, exploration, and solution markers from the maze
    const cleanMaze = maze.map(row => 
      row.map(cell => ({
        ...cell,
        isPath: false,
        isExplored: false,
        isSolution: false,
      }))
    );
    setMaze(cleanMaze);
  }, [maze]);

  const handleResetMaze = useCallback(() => {
    setUserPath([]);
    setSolveStartTime(null);
    setSolveEndTime(null);
    setGameState('manual-solving');
    setLastSolveMethod(null);
    
    // Clear all paths, exploration, and solution markers from the maze
    const cleanMaze = maze.map(row => 
      row.map(cell => ({
        ...cell,
        isPath: false,
        isExplored: false,
        isSolution: false,
      }))
    );
    setMaze(cleanMaze);
  }, [maze]);

  const handleAutoSolve = useCallback((algorithm?: Algorithm) => {
    if (maze.length === 0) return;
    
    const algorithmToUse = algorithm || selectedAlgorithm;
    setSelectedAlgorithm(algorithmToUse);
    
    // If no timer was started yet, start one now for auto-solve
    if (!solveStartTime) {
      setSolveStartTime(Date.now());
    }
    
    setGameState('auto-solving');
    setUserPath([]);
    
    // Clear all existing paths and solution markers from the maze
    const cleanMaze = maze.map(row => 
      row.map(cell => ({
        ...cell,
        isPath: false,
        isExplored: false,
        isSolution: false,
      }))
    );
    setMaze(cleanMaze);
    
    const solver = algorithmToUse === 'astar' ? solveMazeAStar : solveMazeBFS;
    
    solver(
      cleanMaze,
      { x: config.startX, y: config.startY },
      { x: config.endX, y: config.endY },
      config.generationSpeed,
      setMaze,
      () => {
        setGameState('victory');
        setLastSolveMethod('auto');
      },
      () => {
        // Timer stops when solution is found
        setSolveEndTime(Date.now());
      },
      () => maze // Pass current maze state for solution animation
    );
  }, [maze, config, selectedAlgorithm, solveStartTime]);

  const isValidMove = useCallback(
		(from: Position, to: Position): boolean => {
			if (!maze[from.y] || !maze[from.y][from.x]) return false;

			const fromCell = maze[from.y][from.x];
			const dx = to.x - from.x;
			const dy = to.y - from.y;

			if (dx === 1 && dy === 0) return !fromCell.walls.right;
			if (dx === -1 && dy === 0) return !fromCell.walls.left;
			if (dx === 0 && dy === 1) return !fromCell.walls.bottom;
			if (dx === 0 && dy === -1) return !fromCell.walls.top;

			return false;
		},
		[maze]
	);

  const handleCellInteraction = useCallback((x: number, y: number) => {
    if (gameState !== 'manual-solving') return;
    
    if (!solveStartTime) {
      setSolveStartTime(Date.now());
    }

    const newPath = [...userPath];
    const existingIndex = newPath.findIndex(pos => pos.x === x && pos.y === y);
    
    if (existingIndex !== -1) {
      // Allow removing from path by clicking on existing path cell
      newPath.splice(existingIndex);
    } else {
      // Validate the move before adding to path
      if (newPath.length === 0) {
        // First move must be the start position
        if (x !== config.startX || y !== config.startY) {
          return; // Invalid: must start at start position
        }
      } else {
        // Check if the move is valid from the last position
        const lastPos = newPath[newPath.length - 1];
        if (!isValidMove(lastPos, { x, y })) {
          return; // Invalid move: not adjacent or blocked by wall
        }
      }
      
      newPath.push({ x, y });
    }
    
    setUserPath(newPath);
    
    const newMaze = maze.map(row => 
      row.map(cell => ({
        ...cell,
        isPath: newPath.some(pos => pos.x === cell.x && pos.y === cell.y)
      }))
    );
    setMaze(newMaze);
    
    if (x === config.endX && y === config.endY) {
      setSolveEndTime(Date.now());
      setGameState('victory');
      setLastSolveMethod('manual');
    }
  }, [gameState, userPath, maze, config, solveStartTime, isValidMove]);

  const handleMouseDown = useCallback((x: number, y: number) => {
    setIsDragging(true);
    handleCellInteraction(x, y);
  }, [handleCellInteraction]);

  const handleMouseEnter = useCallback((x: number, y: number) => {
    if (isDragging) {
      // Only add to path during drag, don't allow removal during drag
      if (userPath.length === 0) {
        // First move must be start position
        if (x === config.startX && y === config.startY) {
          handleCellInteraction(x, y);
        }
      } else {
        // Check if this cell is already in the path
        const existingIndex = userPath.findIndex(pos => pos.x === x && pos.y === y);
        if (existingIndex === -1) {
          // Not in path, check if it's a valid move
          const lastPos = userPath[userPath.length - 1];
          if (isValidMove(lastPos, { x, y })) {
            handleCellInteraction(x, y);
          }
        }
      }
    }
  }, [isDragging, handleCellInteraction, userPath, config, isValidMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleStartOver = useCallback(() => {
    setGameState('title');
    setMaze([]);
    setUserPath([]);
    setSolveStartTime(null);
    setSolveEndTime(null);
    setLastSolveMethod(null);
    setIsDragging(false);
    if (generationRef.current) {
      clearTimeout(generationRef.current);
    }
    if (solvingRef.current) {
      clearTimeout(solvingRef.current);
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'manual-solving') return;
    
    // If no path exists, start at start position
    if (userPath.length === 0) {
      if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        if (!solveStartTime) {
          setSolveStartTime(Date.now());
        }
        handleCellInteraction(config.startX, config.startY);
      }
      return;
    }
    
    const currentPos = userPath[userPath.length - 1];
    let newX = currentPos.x;
    let newY = currentPos.y;
    
    switch (e.key) {
      case 'ArrowUp':
        newY = Math.max(0, newY - 1);
        break;
      case 'ArrowDown':
        newY = Math.min(config.height - 1, newY + 1);
        break;
      case 'ArrowLeft':
        newX = Math.max(0, newX - 1);
        break;
      case 'ArrowRight':
        newX = Math.min(config.width - 1, newX + 1);
        break;
      case 'Backspace':
        // Allow removing the last move
        e.preventDefault();
        if (userPath.length > 0) {
          const newPath = [...userPath];
          newPath.pop();
          setUserPath(newPath);
          
          const newMaze = maze.map(row => 
            row.map(cell => ({
              ...cell,
              isPath: newPath.some(pos => pos.x === cell.x && pos.y === cell.y)
            }))
          );
          setMaze(newMaze);
        }
        return;
      default:
        return;
    }
    
    e.preventDefault();
    
    if (maze[newY] && maze[newY][newX] && isValidMove(currentPos, { x: newX, y: newY })) {
      handleCellInteraction(newX, newY);
    }
  }, [gameState, userPath, config, maze, handleCellInteraction, isValidMove, solveStartTime]);

  

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleKeyDown, handleMouseUp]);

  const renderCurrentScreen = () => {
    switch (gameState) {
      case 'title':
        return <TitleScreen onStart={handleStartGame} />;
      
      case 'config':
        return (
          <ConfigScreen
            config={config}
            onConfigComplete={handleConfigComplete}
          />
        );
      
      case 'generating':
      case 'manual-solving':
      case 'auto-solving':
        return (
          <MazeDisplay
            maze={maze}
            config={config}
            gameState={gameState}
            isGenerating={isGenerating}
            selectedAlgorithm={selectedAlgorithm}
            onAlgorithmChange={setSelectedAlgorithm}
            onStartTimer={handleStartTimer}
            onAutoSolve={handleAutoSolve}
            onClearBoard={handleClearBoard}
            onResetMaze={handleResetMaze}
            onCellMouseDown={handleMouseDown}
            onCellMouseEnter={handleMouseEnter}
            onStartOver={handleStartOver}
            solveStartTime={solveStartTime}
            lastSolveMethod={lastSolveMethod}
          />
        );
      
      case 'victory':
        return (
          <VictoryScreen
            solveTime={solveEndTime && solveStartTime ? solveEndTime - solveStartTime : 0}
            onAutoSolve={handleAutoSolve}
            onResetMaze={handleResetMaze}
            onStartOver={handleStartOver}
            lastSolveMethod={lastSolveMethod}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-background">
      <div className="flex-1 overflow-auto p-2 sm:p-4">
        {renderCurrentScreen()}
      </div>
    </div>
  );
};

export default MazeGenerator;