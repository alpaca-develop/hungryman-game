import React from 'react';
import { GameControlsProps } from '@/types/hungryman.type';

export const GameControls: React.FC<GameControlsProps> = ({ 
  gameState, 
  onPause, 
  onRestart 
}) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={onPause}
        className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors"
        disabled={gameState === 'GAME_OVER' || gameState === 'WIN'}
      >
        {gameState === 'PAUSED' ? 'RESUME' : 'PAUSE'}
      </button>
      <button
        onClick={onRestart}
        className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition-colors"
      >
        RESTART
      </button>
    </div>
  );
};