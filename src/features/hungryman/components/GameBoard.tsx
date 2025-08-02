import React from 'react';
import { GameBoardProps, CellType } from '@/types/hungryman.type';
import { CELL_SIZE } from '@/utils/constants';

export const GameBoard: React.FC<GameBoardProps> = ({ 
  maze, 
  hungrymanPosition, 
  ghosts 
}) => {
  const renderCell = (cell: CellType, x: number, y: number) => {
    const isHungryman = hungrymanPosition.x === x && hungrymanPosition.y === y;
    const ghost = ghosts.find(g => g.position.x === x && g.position.y === y);

    return (
      <div
        key={`${x}-${y}`}
        className="relative"
        style={{
          width: CELL_SIZE,
          height: CELL_SIZE,
          backgroundColor: cell === 'WALL' ? '#1e3a8a' : '#000'
        }}
      >
        {cell === 'DOT' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
        )}
        
        {cell === 'POWER_DOT' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        )}
        
        {isHungryman && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-yellow-400 rounded-full" />
          </div>
        )}
        
        {ghost && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-4 h-4 rounded-t-full"
              style={{ backgroundColor: ghost.color }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-black p-2 rounded">
      {maze.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => renderCell(cell, x, y))}
        </div>
      ))}
    </div>
  );
};