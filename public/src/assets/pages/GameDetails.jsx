import { useDispatch, useSelector } from 'react-redux'

import { Link, useParams, useNavigate } from 'react-router-dom'

import { Button } from '@mui/material'

import { useEffect, useState } from 'react'

import { gameService } from '../../services/game.service.js'
import { removeGame } from '../../store/actions/game.actions.js'

import { addGameToCart } from '../../store/actions/user.actions.js'

import gameCover from '/game-cover.jpg'
import loader from '/loader.svg'

// import '../css/GameDetails.css'
import { showSuccessMsg } from '../../services/event-bus.service.js'
import { showErrorMsg } from '../../services/event-bus.service.js'
import { userService } from '../../services/user.service.js'
import { setIsLoadingFalse } from '../../store/actions/game.actions.js'
import { setIsLoadingTrue } from '../../store/actions/game.actions.js'
export function GameDetails() {
  const params = useParams()
  const navigate = useNavigate()

  const [game, setGame] = useState({ labels: [], companies: [] })

  const [user, setUser] = useState(userService.getLoggedinUser() || {})
  const isLoading = useSelector((storeState) => storeState.gameModule.isLoading)

  useEffect(() => {
    setIsLoadingTrue()
    loadGame().then(() => {
      setIsLoadingFalse()
    })
  }, [params.gameId])

  function loadGame() {
    return gameService
      .getById(params.gameId)
      .then((game) => {
        setGame({ ...game })
      })
      .catch((err) => {
        console.error('err:', err)
        showErrorMsg('Cannot load game')
        navigate('/game')
      })
  }

  function onRemoveGame(gameId) {
    removeGame(gameId)
      .then(() => {
        showSuccessMsg('Deleted game')
        navigate('/game')
      })
      .catch((err) => {
        console.error('err:', err)
        showErrorMsg('Cannot delete game')
      })
  }

  function onAddGameToCart(game) {
    if (!game.inStock) {
      showErrorMsg('Game is not in stock')
      return
    }

    if (!user.gamesInCart) {
      showErrorMsg('Please login or create account')

      return
    }
    addGameToCart(game)
      .then(() => {
        // userService.addGameToCart(game)
        showSuccessMsg('Game added')
        // navigate(`/game`)
      })
      .catch((err) => {
        showErrorMsg(`Couldn't add game`)
      })
  }
  return (
    <section className='section-container game-details'>
      {isLoading && (
        <div className='loader'>
          <img src={loader} alt='' />
        </div>
      )}
      <div className='buttons-container'>
        <Button variant='outlined'>
          <Link to={`/game`} className='back-button'>
            <i className='fa-solid fa-rotate-left'></i>
          </Link>
        </Button>
      </div>
      {!game.inStock && <span className='unavailable'>OUT OF STOCK</span>}
      <div className='cover-container'>
        {user.isAdmin && (
          <section className='buttons-container'>
            <button
              onClick={() => onRemoveGame(game._id)}
              className='fa-solid fa-trash'
            ></button>
            <button>
              <Link to={`/game/edit/${game._id}`}>
                <i className='fa-solid fa-pen-to-square'></i>
              </Link>
            </button>
          </section>
        )}
        <img className='game-details-cover' src={game.cover} alt='' />
      </div>
      {user && (
        <Button variant='outlined' onClick={() => onAddGameToCart(game)}>
          Add to Cart
        </Button>
      )}
      <h2>{game.name}</h2>
      <h3>{game.price}$</h3>
      <p>{game.preview}</p>
      {/* {game.company.map((company) => {
        return <h4>{company}</h4>
      })} */}
      <h3>Categories:</h3>
      <div className='labels-container'>
        {game.labels.map((label) => {
          return <span key={label}>{label}</span>
        })}
      </div>
      <div className='nav-buttons-container'></div>
    </section>
  )
}
