import React, { useState, useEffect } from 'react';

interface SudokuPreviewProps {
  className?: string;
}

const SudokuPreview: React.FC<SudokuPreviewProps> = ({ className = '' }) => {
  const [animationStep, setAnimationStep] = useState(0);

  // Sample sudoku grid states for gradual fill animation
  const sampleGridStates = [
    // State 1: Very sparse starting grid
    [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 8, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 5, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 2, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    // State 2: Adding a few more numbers
    [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [0, 0, 0, 0, 6, 0, 0, 0, 0],
      [4, 0, 0, 0, 5, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 0, 9, 0, 0, 0],
      [0, 0, 0, 0, 8, 0, 0, 0, 9]
    ],
    // State 3: Medium fill
    [
      [5, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [0, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 5, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ],
    // State 4: More filled
    [
      [5, 3, 0, 6, 0, 0, 9, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 3, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 6, 8, 5, 3, 7, 0, 1],
      [7, 1, 0, 0, 2, 0, 0, 5, 6],
      [0, 6, 1, 0, 3, 0, 2, 8, 0],
      [2, 0, 0, 4, 1, 9, 6, 0, 5],
      [3, 0, 5, 0, 8, 6, 0, 7, 9]
    ],
    // State 5: Nearly complete
    [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ],
    // State 6: Back to puzzle with some removed
    [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ]
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % sampleGridStates.length);
    }, 1500); // Faster animation - 1.5 seconds instead of 3

    return () => clearInterval(interval);
  }, [sampleGridStates.length]);

  const currentGrid = sampleGridStates[animationStep];

  return (
    <div className={`w-full h-full flex items-center justify-center p-4 relative group ${className}`}>
      <div className="grid grid-cols-9 gap-0 border-2 border-foreground bg-background shadow-lg rounded">
        {currentGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isBoxBorder = {
              right: colIndex === 2 || colIndex === 5,
              bottom: rowIndex === 2 || rowIndex === 5,
            };

            // Checkerboard pattern - alternating cells
            const isLightCell = (rowIndex + colIndex) % 2 === 0;
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-10 h-10 flex items-center justify-center text-base font-semibold
                  transition-all duration-500 border-r border-b border-gray-300 dark:border-gray-500
                  ${isBoxBorder.right ? 'border-r-4 border-r-gray-800' : ''}
                  ${isBoxBorder.bottom ? 'border-b-4 border-b-gray-800' : ''}
                  ${isLightCell ? 'bg-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-600'}
                  ${cell !== 0 ? 'text-foreground' : ''}
                `}
              >
                {cell !== 0 ? cell : ''}
              </div>
            );
          })
        )}
      </div>
      
      {/* Hover overlay with play icon - like maze preview */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded">
        <div className="text-center text-white">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-2 mx-auto backdrop-blur-sm">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <p className="text-sm font-medium">Try Interactive Demo</p>
        </div>
      </div>
    </div>
  );
};

export default SudokuPreview;