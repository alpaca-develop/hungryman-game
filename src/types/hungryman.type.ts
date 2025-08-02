export type Position = {
  x: number;
  y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'NONE';
export type CellType = 'WALL' | 'DOT' | 'EMPTY' | 'POWER_DOT';
export type GameState = 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'WIN';

export type Ghost = {
  id: number;
  position: Position;
  direction: Direction;
  color: string;
};

export type GameBoardProps = {
  maze: CellType[][];
  hungrymanPosition: Position;
  ghosts: Ghost[];
};

export type ScoreBoardProps = {
  score: number;
  lives: number;
};

export type GameControlsProps = {
  gameState: GameState;
  onPause: () => void;
  onRestart: () => void;
};

export type UseHungrymanReturn = {
  hungrymanPosition: Position;
  ghosts: Ghost[];
  maze: CellType[][];
  score: number;
  lives: number;
  gameState: GameState;
  onPause: () => void;
  onRestart: () => void;
};