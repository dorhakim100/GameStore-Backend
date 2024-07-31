import { useDispatch, useSelector } from 'react-redux'

import { Link, useParams, useNavigate } from 'react-router-dom'

import { useEffect, useState, useRef } from 'react'

import { gameService } from '../../services/game.service.js'
import { saveGame } from '../../store/actions/game.actions.js'
import { loadGames } from '../../store/actions/game.actions.js'

import { showSuccessMsg } from '../../services/event-bus.service.js'
import { showErrorMsg } from '../../services/event-bus.service.js'

import { MyForm } from './MyForm.jsx'

// import '../css/GameEdit.css'

export function GameEdit() {
  const labels = [
    'Adventure',
    'RPG',
    'Action',
    'Platformer',
    'Sandbox',
    'Survival',
    'Shooter',
    'Battle Royale',
    'Simulation',
    'Social',
    'Party',
    'Social Deduction',
    'Roguelike',
    'Fighting',
    'Racing',
  ]
  const companies = ['Sony', 'Nintendo', 'Microsoft']

  const params = useParams()
  const navigate = useNavigate()

  const [game, setGame] = useState({ labels: [], companies: [] })
  const [editGame, setEditGame] = useState(game)
  const [cover, setCover] = useState(null)
  // const coverRef = useRef(cover)

  const filterBy = useSelector(
    (selectorState) => selectorState.gameModule.filterBy
  )

  useEffect(() => {
    loadGame()
  }, [params.gameId])

  function loadGame() {
    if (params.gameId === undefined) return
    gameService
      .getById(params.gameId)
      .then((game) => {
        setEditGame({ ...game })
        setGame({ ...game })
        setCover(game.cover)
      })
      .catch((err) => {
        console.error('err:', err)
        showErrorMsg('Cannot load game')
        navigate('/game')
      })
  }

  function handleChange({ target }) {
    const field = target.name
    let value = target.value
    let checkedButton = target.id

    let newCompanies = []
    let newLabels = []

    switch (target.type) {
      case 'number':
      case 'range':
        value = +value || ''
        break

      case 'checkbox':
        if (field === 'companies') {
          if (editGame.companies.includes(checkedButton)) {
            const idx = editGame.companies.findIndex(
              (company) => company === checkedButton
            )
            editGame.companies.splice(idx, 1)
            newCompanies = editGame.companies
          } else {
            newCompanies = editGame.companies.push(checkedButton)
          }
          setEditGame({ ...editGame, newCompanies })
        }
        if (field === 'labels') {
          if (editGame.labels.includes(checkedButton)) {
            const idx = editGame.labels.findIndex(
              (label) => label === checkedButton
            )
            editGame.labels.splice(idx, 1)
            newLabels = editGame.labels
          } else {
            newLabels = editGame.labels.push(checkedButton)
          }
          setEditGame({ ...editGame, newLabels })
        }
        if (field === 'inStock') {
          editGame.inStock = target.checked
          setEditGame({ ...editGame })
        }
        return
        break

      default:
        break
    }

    setEditGame({ ...editGame, [field]: value })
  }

  function onSaveGame(ev) {
    ev.preventDefault()
    const { name, price, labels, companies } = editGame
    if (!cover) {
      editGame.cover =
        'https://vglist.co/packs/media/images/no-cover-369ad8f0ea82dde5923c942ba1a26482.png'
    } else {
      editGame.cover = cover
    }
    // todoService.save(todoToEdit)
    saveGame(editGame)
      .then(() => {
        showSuccessMsg('Game saved')
        loadGames(filterBy).then(() => {
          navigate(`/game`)
        })
      })
      .catch((err) => {
        showErrorMsg('Cannot save todo')
        console.log('err:', err)
      })
  }

  function renderCover({ target }) {
    const coverSrc = target.value
    setCover(coverSrc)
  }

  return (
    <section className='section-container'>
      {/* {game && <h2>Edit{` - ${game.name}`}</h2>} */}
      {cover && <img src={cover} alt='' className='game-cover-edit' />}
      <form action='' className='game-edit-form' onSubmit={onSaveGame}>
        <div>
          <label htmlFor=''>Game Title:</label>
          <input
            onChange={handleChange}
            name='name'
            type='text'
            value={editGame.name}
            style={{ width: 200 }}
          />
        </div>
        <div>
          <label htmlFor=''>Game Price:</label>
          <input
            name='price'
            onChange={handleChange}
            type='number'
            value={editGame.price}
            style={{ width: 50 }}
          />
          <span>$</span>
        </div>
        <div>
          <label htmlFor=''>In Stock</label>
          <input onChange={handleChange} type='checkbox' name={'inStock'} />
        </div>
        <div>
          <label htmlFor=''>Preview:</label>
          <textarea
            onChange={handleChange}
            name='preview'
            type='text'
            value={editGame.preview}
            style={{ width: 350, height: 200 }}
          />
        </div>
        <label htmlFor=''>Companies:</label>
        <div>
          <div className='companies-container'>
            {companies.map((company) => {
              return (
                <div className='transparent-checkbox company-container'>
                  <label htmlFor={company}>{company}</label>
                  <input
                    onChange={handleChange}
                    type='checkbox'
                    checked={editGame.companies.includes(company)}
                    name='companies'
                    id={company}
                  />
                </div>
              )
            })}
          </div>
        </div>
        <label htmlFor=''>Categories:</label>
        <div>
          <div className='labels-container form'>
            {labels.map((label) => {
              return (
                <div className='transparent-checkbox label-container'>
                  <label htmlFor={label}>{label}</label>
                  <input
                    onChange={handleChange}
                    checked={editGame.labels.includes(label)}
                    type='checkbox'
                    name='labels'
                    id={label}
                  />
                </div>
              )
            })}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor=''>Cover link:</label>
          <input onChange={renderCover} type='text' style={{ width: 350 }} />
        </div>
        <input type='submit' value='Submit'></input>
      </form>
    </section>
  )
}
