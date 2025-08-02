import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Position, 
  Direction, 
  CellType, 
  Ghost, 
  GameState,
  UseHungrymanReturn 
} from '@/types/hungryman.type';
import { MAZE_WIDTH, MAZE_HEIGHT, INITIAL_LIVES, MAZE_LAYOUT } from '@/utils/constants';

export const useHungryman = (): UseHungrymanReturn => {
  const [hungrymanPosition, setHungrymanPosition] = useState<Position>({ x: 9, y: 15 });
  const [hungrymanDirection, setHungrymanDirection] = useState<Direction>('NONE');
  const [ghosts, setGhosts] = useState<Ghost[]>([
    { id: 1, position: { x: 9, y: 9 }, direction: 'UP', color: '#FF0000' },
    { id: 2, position: { x: 8, y: 9 }, direction: 'LEFT', color: '#00FFFF' },
    { id: 3, position: { x: 10, y: 9 }, direction: 'RIGHT', color: '#FFB8FF' },
    { id: 4, position: { x: 9, y: 10 }, direction: 'DOWN', color: '#FFB852' }
  ]);
  const [maze, setMaze] = useState<CellType[][]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [gameState, setGameState] = useState<GameState>('PLAYING');
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const initializeMaze = useCallback(() => {
    const initialMaze: CellType[][] = MAZE_LAYOUT.map(row =>
      row.map(cell => {
        switch(cell) {
          case 0: return 'DOT';
          case 1: return 'WALL';
          case 2: return 'EMPTY';
          case 3: return 'POWER_DOT';
          default: return 'EMPTY';
        }
      })
    );
    return initialMaze;
  }, []);

  // Initialize maze
  useEffect(() => {
    setMaze(initializeMaze());
  }, [initializeMaze]);

  // Check if movement is possible
  const canMove = useCallback((position: Position, direction: Direction): boolean => {
    let newX = position.x;
    let newY = position.y;
    
    switch(direction) {
      case 'UP': newY--; break;
      case 'DOWN': newY++; break;
      case 'LEFT': newX--; break;
      case 'RIGHT': newX++; break;
      default: return false;
    }
    
    if (newX < 0 || newX >= MAZE_WIDTH || newY < 0 || newY >= MAZE_HEIGHT) {
      return false;
    }
    
    return maze[newY]?.[newX] !== 'WALL';
  }, [maze]);

  // Move Hungryman
  const moveHungryman = useCallback(() => {
    if (hungrymanDirection === 'NONE' || !canMove(hungrymanPosition, hungrymanDirection)) {
      return;
    }
    
    setHungrymanPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;
      
      switch(hungrymanDirection) {
        case 'UP': newY--; break;
        case 'DOWN': newY++; break;
        case 'LEFT': newX--; break;
        case 'RIGHT': newX++; break;
      }
      
      // Tunnel handling
      if (newX < 0) newX = MAZE_WIDTH - 1;
      if (newX >= MAZE_WIDTH) newX = 0;
      
      return { x: newX, y: newY };
    });
  }, [hungrymanDirection, hungrymanPosition, canMove]);

  // Collect dots
  useEffect(() => {
    if (maze[hungrymanPosition.y]?.[hungrymanPosition.x] === 'DOT') {
      setScore(prev => prev + 10);
      setMaze(prev => {
        const newMaze = [...prev];
        newMaze[hungrymanPosition.y][hungrymanPosition.x] = 'EMPTY';
        return newMaze;
      });
    } else if (maze[hungrymanPosition.y]?.[hungrymanPosition.x] === 'POWER_DOT') {
      setScore(prev => prev + 50);
      setMaze(prev => {
        const newMaze = [...prev];
        newMaze[hungrymanPosition.y][hungrymanPosition.x] = 'EMPTY';
        return newMaze;
      });
    }
  }, [hungrymanPosition, maze]);

  // Move ghosts
  const moveGhosts = useCallback(() => {
    setGhosts(prevGhosts => 
      prevGhosts.map(ghost => {
        const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        const validDirections = directions.filter(dir => canMove(ghost.position, dir));
        
        if (validDirections.length === 0) return ghost;
        
        const newDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
        let newX = ghost.position.x;
        let newY = ghost.position.y;
        
        switch(newDirection) {
          case 'UP': newY--; break;
          case 'DOWN': newY++; break;
          case 'LEFT': newX--; break;
          case 'RIGHT': newX++; break;
        }
        
        return {
          ...ghost,
          position: { x: newX, y: newY },
          direction: newDirection
        };
      })
    );
  }, [canMove]);

  // Collision detection
  useEffect(() => {
    const collision = ghosts.some(ghost => 
      ghost.position.x === hungrymanPosition.x && ghost.position.y === hungrymanPosition.y
    );
    
    if (collision && gameState === 'PLAYING') {
      setLives(prev => prev - 1);
      setHungrymanPosition({ x: 9, y: 15 });
      setHungrymanDirection('NONE');
    }
  }, [hungrymanPosition, ghosts, gameState]);

  // Check game over
  useEffect(() => {
    if (lives <= 0) {
      setGameState('GAME_OVER');
    }
  }, [lives]);

  // Check win condition
  useEffect(() => {
    const hasDotsLeft = maze.some(row => 
      row.some(cell => cell === 'DOT' || cell === 'POWER_DOT')
    );
    
    if (!hasDotsLeft && maze.length > 0) {
      setGameState('WIN');
    }
  }, [maze]);

  // Game loop
  useEffect(() => {
    if (gameState === 'PLAYING') {
      gameLoopRef.current = setInterval(() => {
        moveHungryman();
        moveGhosts();
      }, 200);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, moveHungryman, moveGhosts]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        
        switch(e.key) {
          case 'ArrowUp':
            if (canMove(hungrymanPosition, 'UP')) setHungrymanDirection('UP');
            break;
          case 'ArrowDown':
            if (canMove(hungrymanPosition, 'DOWN')) setHungrymanDirection('DOWN');
            break;
          case 'ArrowLeft':
            if (canMove(hungrymanPosition, 'LEFT')) setHungrymanDirection('LEFT');
            break;
          case 'ArrowRight':
            if (canMove(hungrymanPosition, 'RIGHT')) setHungrymanDirection('RIGHT');
            break;
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        if (gameState !== 'GAME_OVER' && gameState !== 'WIN') {
          setGameState(prev => prev === 'PLAYING' ? 'PAUSED' : 'PLAYING');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [hungrymanPosition, canMove, gameState]);

  // Pause function
  const onPause = useCallback(() => {
    setGameState(prev => prev === 'PLAYING' ? 'PAUSED' : 'PLAYING');
  }, []);

  // Restart function
  const onRestart = useCallback(() => {
    setHungrymanPosition({ x: 9, y: 15 });
    setHungrymanDirection('NONE');
    setGhosts([
      { id: 1, position: { x: 9, y: 9 }, direction: 'UP', color: '#FF0000' },
      { id: 2, position: { x: 8, y: 9 }, direction: 'LEFT', color: '#00FFFF' },
      { id: 3, position: { x: 10, y: 9 }, direction: 'RIGHT', color: '#FFB8FF' },
      { id: 4, position: { x: 9, y: 10 }, direction: 'DOWN', color: '#FFB852' }
    ]);
    setMaze(initializeMaze());
    setScore(0);
    setLives(INITIAL_LIVES);
    setGameState('PLAYING');
  }, [initializeMaze]);

  return {
    hungrymanPosition,
    ghosts,
    maze,
    score,
    lives,
    gameState,
    onPause,
    onRestart
  };
};