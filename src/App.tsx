import { useRef, useState } from 'react';
import './App.css'
import { BoardComponent } from './components/Board'
import { NetworkComponent } from './components/Network'
import { Game } from './models/Game';
import { MovesHistory } from './components/MovesHistory';
import { FIGURE_COLORS } from './models/Figure';


function App() {
  const gameRef = useRef(new Game());
  const [gameState, setGameState] = useState(gameRef.current.toState());

  return (
    <div>
      <NetworkComponent
        renderBody={({ send, subscribeOnMessage }) =>
          <>
            <div className='game'>
              <MovesHistory color={FIGURE_COLORS.Black} records={gameState.hitstory[FIGURE_COLORS.Black]} />
              <BoardComponent
                send={send}
                subscribeOnMessage={subscribeOnMessage}
                game={gameRef.current}
                gameState={gameState}
                setGameState={setGameState as any}
              />
              <MovesHistory color={FIGURE_COLORS.White} records={gameState.hitstory[FIGURE_COLORS.White]} />
            </div>
          </>
        } />
    </div >
  )
}

export default App
