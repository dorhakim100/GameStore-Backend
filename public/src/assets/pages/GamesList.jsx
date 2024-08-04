import { useDispatch, useSelector } from 'react-redux'

import { useEffect } from 'react'
import { Link } from 'react-router-dom'

// import Loader from './Loader.jsx'
import loader from '/loader.svg'

export function GamesList({ games }) {
  // const games = useSelector((storeState) => storeState.gameModule.games)
  console.log(games)
  useEffect(() => {
    // loadGames().then(() => {})
  }, [])

  return (
    <div className='games-container'>
      {(games.length > 0 &&
        games.map((game) => {
          return (
            <div key={game._id} className='game-container'>
              <Link
                to={`/game/${game._id}`}
                onClick={() => (document.documentElement.scrollTop = 0)}
              >
                <div className='game-name-container'>
                  <h3 className='game-name'>{game.name}</h3>
                </div>
                {!game.inStock && (
                  <span className='unavailable'>OUT OF STOCK</span>
                )}
                <div className='hover-shadow'>
                  <img className='game-cover' src={game.cover} alt='' />
                </div>

                <img className='game-cover' src={game.cover} alt='' />
                <span className='game-price'>{game.price}$</span>
              </Link>
            </div>
          )
        })) || (
        <div className='loader'>
          <img src={loader} alt='' />
        </div>
      )}
    </div>
  )
}
