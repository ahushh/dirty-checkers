import { useCallback, useEffect, useRef, useState } from 'react'
import { Game, GameState } from '../models/Game'
import cn from 'classnames'
import './Board.css'
import { TFriendlyCoordinates } from '../models/Coordinates'
import { INetworkCallback, INetworkCallbackData } from './Network'
import { FIGURE_COLORS } from '../models/Figure'


const horizontal = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const vertical = new Array(8).fill(null).map((_, i) => i + 1).reverse();


interface IProps {
  game: Game;
  gameState: GameState;
  setGameState: (state: GameState) => void;
  send: INetworkCallback;
  subscribeOnMessage: (callback: INetworkCallback) => void;
}
export const BoardComponent = ({ send, subscribeOnMessage, game, gameState, setGameState }: IProps) => {
  const [selectedFigure, setSelectedFigure] = useState('');
  const [highlightedMoves, setHighlightedMoves] = useState<string[]>([]);

  const handleFigureSelection = useCallback((c) => {
    if (!gameState.isStarted) {
      return
    }
    if (game.player && game.player !== gameState.turn as string) {
      return;
    }
    if (gameState.figuresMustJump.length && !gameState.figuresMustJump.includes(c)) {
      return;
    }
    if (!gameState.figures[gameState.turn].includes(c)) {
      return;
    }
    let newC;
    if (c === selectedFigure) {
      newC = '';
    } else {
      newC = c;
    }
    setSelectedFigure(newC);
    if (newC) {
      let moves = game.getJumps(newC);
      if (moves.length === 0) {
        moves = game.getMoves(newC);
      }
      setHighlightedMoves(moves);
    } else {
      setHighlightedMoves([]);
    }
  }, [game, gameState.figures, gameState.figuresMustJump, gameState.isStarted, gameState.turn, selectedFigure])

  const handleMove = useCallback((c: TFriendlyCoordinates, options = { remote: false, selectedFigure }) => {
    if ((!selectedFigure || selectedFigure === c) && options.remote === false) {
      return
    }
    if (options.remote === false) {
      send({ figure: selectedFigure as TFriendlyCoordinates, to: c });
    }
    console.log('handleMove selectedFigure', options.selectedFigure || selectedFigure);

    const { isJump, newCoordinates } = game.move((options.selectedFigure || selectedFigure) as TFriendlyCoordinates, c);
    setHighlightedMoves([]);
    if (isJump) {
      setGameState(game.toState());
      if (game.getJumps(newCoordinates).length === 0) {
        setSelectedFigure('');
        game.nextTurn();
        setGameState(game.toState());
      } else {
        setSelectedFigure(newCoordinates);
        setHighlightedMoves(game.getJumps(newCoordinates))
      }
    } else {
      game.nextTurn();
      setGameState(game.toState());
      setSelectedFigure('');
    }
  }, [game, selectedFigure, send, setGameState])

  useEffect(() => {
    const callback = (data: INetworkCallbackData) => {
      console.log('onMessage', data);
      if (data.isHost === true) {
        game.start();
        game.player = FIGURE_COLORS.White;
        setGameState(game.toState());
      } else if (data.isHost === false) {
        game.start();
        game.player = FIGURE_COLORS.Black;
        setGameState(game.toState());
      }
      console.log('onMessage data.coordinates', data.to);
      if (data.figure && data.to) {
        handleMove(data.to, { remote: true, selectedFigure: data.figure });
      }
    };
    subscribeOnMessage(callback);
    return () => {
      // TODO: unsubscribe
    }
  }, [game, handleMove, setGameState, subscribeOnMessage])

  const onNewCellClicked = useCallback((c: TFriendlyCoordinates) => {
    if (game.player && game.player !== gameState.turn as string) {
      return;
    }
    handleMove(c);
  }, [game.player, gameState.turn, handleMove]);

  const handleRestart = useCallback(() => {
    game.start();
    setGameState(game.toState());
  }, [game, setGameState]);

  return <div className='boardContainer'>
    {gameState.isStarted ? <h4>
      Turn: {gameState.turn} | Your Color: {game.player}
    </h4> : null}
    <div>
      {game.isOver() ? <div>
        Game Over
      </div> : null}
      <button className='restart-btn' onClick={handleRestart}>Restart</button>
    </div>

    <div className='board'>
      <div className='coordinates-row' key={'header-top'}>
        {horizontal.map((x, i) => <div key={i} className='coordinates-cell'>{x}</div>)}
      </div>
      {gameState.board.map((x, i) => <div key={i} className='row'>
        <div className='coordinates-cell'>{vertical[i]}</div>
        {x.map((y, j) => {
          return <div
            onClick={() => onNewCellClicked(y.cell.fc)}
            className={cn('cell', y.cell.color, { highlighted: highlightedMoves.includes(y.cell.fc) })}
            key={j}>
            {y.figure ? <div
              onClick={() => handleFigureSelection(y.figure.fc)}
              className={cn('figure', y.figure.color, { selected: selectedFigure === y.figure.fc, isDame: y.figure.isDame })}
            /> : null}
          </div>
        })}
        <div className='coordinates-cell'>{vertical[i]}</div>
      </div>)}
      <div className='coordinates-row' key={'header-bottom'}>
        {horizontal.map((x, i) => <div key={i} className='coordinates-cell'>{x}</div>)}
      </div>
    </div>
  </div>
}