import React from 'react';
import { ScoreBoardProps } from '@/types/hungryman.type';

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, lives }) => {
  return (
    <div className="flex gap-8 text-white text-xl">
      <div>
        <span className="text-gray-400">SCORE: </span>
        <span className="font-bold">{score}</span>
      </div>
      <div>
        <span className="text-gray-400">LIVES: </span>
        <span className="font-bold">
          {Array.from({ length: lives }, () => '❤️').join(' ')}
        </span>
      </div>
    </div>
  );
};