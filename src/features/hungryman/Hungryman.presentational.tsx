import React from 'react';
import { UseHungrymanReturn } from '@/types/hungryman.type';
import { GameBoard } from './components/GameBoard';
import { ScoreBoard } from './components/ScoreBoard';
import { GameControls } from './components/GameControls';

export const HungrymanPresentation: React.FC<UseHungrymanReturn> = ({
  hungrymanPosition,
  ghosts,
  maze,
  score,
  lives,
  gameState,
  onPause,
  onRestart
}) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-yellow-400">HUNGRYMAN</h1>
        
        <ScoreBoard score={score} lives={lives} />
        
        <div className="relative">
          <GameBoard
            maze={maze}
            hungrymanPosition={hungrymanPosition}
            ghosts={ghosts}
          />
          
          {gameState === 'PAUSED' && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <h2 className="text-4xl font-bold text-yellow-400">PAUSED</h2>
            </div>
          )}
          
          {gameState === 'GAME_OVER' && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-red-500 mb-4">GAME OVER</h2>
                <button
                  onClick={onRestart}
                  className="px-6 py-3 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 transition-colors"
                >
                  RESTART
                </button>
              </div>
            </div>
          )}
          
          {gameState === 'WIN' && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-green-500 mb-4">YOU WIN!</h2>
                <p className="text-2xl text-white mb-4">Score: {score}</p>
                <button
                  onClick={onRestart}
                  className="px-6 py-3 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 transition-colors"
                >
                  PLAY AGAIN
                </button>
              </div>
            </div>
          )}
        </div>
        
        <GameControls
          gameState={gameState}
          onPause={onPause}
          onRestart={onRestart}
        />
        
        <div className="text-white text-sm mt-4">
          <p>矢印キーで操作 | SPACEで一時停止</p>
        </div>
      </div>
    </div>
  );
};