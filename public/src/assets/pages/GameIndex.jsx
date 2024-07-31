import { useDispatch, useSelector } from 'react-redux'
// import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { Button, Autocomplete, TextField } from '@mui/material'
import { Loader, Placeholder } from 'rsuite'

import { useEffect, useState } from 'react'

import { loadGames } from '../../store/actions/game.actions.js'

import { GameFilter } from './GameFilter.jsx'
import { GamesList } from './GamesList.jsx'

import { setFilterBy } from '../../store/actions/game.actions.js'
import { setIsLoadingFalse } from '../../store/actions/game.actions.js'
import { setIsLoadingTrue } from '../../store/actions/game.actions.js'
import { utilService } from '../../services/util.service.js'

import { showUserMsg } from '../../services/event-bus.service.js'
import { showSuccessMsg } from '../../services/event-bus.service.js'
import { showErrorMsg } from '../../services/event-bus.service.js'

import gameCover from '/game-cover.jpg'
import loader from '/loader.svg'

// import '../css/GameIndex.css'
import { gameService } from '../../services/game.service.js'
import { userService } from '../../services/user.service.js'

export function GameIndex() {
  const games = useSelector((storeState) => storeState.gameModule.games)
  const isLoading = useSelector((storeState) => storeState.gameModule.isLoading)
  const filterBy = useSelector((storeState) => storeState.gameModule.filterBy)

  const [user, setUser] = useState(userService.getLoggedinUser() || {})

  useEffect(() => {
    console.log(isLoading)
    loadGames().then(() => {
      // setIsLoadingFalse(!isLoading)
    })
  }, [filterBy])

  function onSetFilter(filterBy) {
    setFilterBy(filterBy)
  }

  function onChangePageIdx(diff) {
    if (filterBy.pageIdx === 0 && diff === -1) return

    setIsLoadingTrue()
    // gameService.getMaxPage(filterBy).then((maxPage) => {
    //   if (filterBy.pageIdx + 1 === maxPage && diff === 1) {
    //     const newPageIdx = 0
    //     setFilterBy({ ...filterBy, pageIdx: newPageIdx })
    //     return
    //   }
    //   if (filterBy.pageIdx === 0 && diff === -1) return
    //   const newPageIdx = filterBy.pageIdx + diff
    //   setFilterBy({ ...filterBy, pageIdx: newPageIdx })
    // })
    gameService.getMaxPage(filterBy).then((maxPage) => {
      console.log(maxPage)
      console.log(filterBy.pageIdx)
      if (filterBy.pageIdx + 1 === maxPage && diff === 1) {
        const newPageIdx = 0
        setFilterBy({ ...filterBy, pageIdx: newPageIdx })
        return
      }
      if (filterBy.pageIdx === 0 && diff === -1) return
      const newPageIdx = filterBy.pageIdx + diff
      setFilterBy({ ...filterBy, pageIdx: newPageIdx })
    })
  }

  function onSort(ev, value) {
    const newSortBy = value.replace(' ', '')

    setFilterBy({ ...filterBy, sortBy: newSortBy, pageIdx: 0 })
  }

  const options = [
    'Name Descending',
    'Name Ascending',
    'Price Descending',
    'Price Ascending',
    'Time Descending',
    'Time Ascending',
  ]

  return (
    <section className='section-container game-index'>
      {isLoading && (
        <div className='loader'>
          <img src={loader} alt='' />
        </div>
      )}
      <div className='game-index-user-interface'>
        <GameFilter
          filterBy={filterBy}
          onSetFilter={(event, value) => onSetFilter(ev, value)}
        />
        {/* <h2>My Games</h2> */}
        <div>
          <div className='sort-container'>
            <Autocomplete
              onChange={onSort}
              disablePortal
              id='combo-box-demo'
              options={options}
              sx={{
                width: 250,
              }}
              renderInput={(params) => <TextField {...params} label='Sort' />}
            />
          </div>
          {/* <label htmlFor='sortBy'>Sort By:</label>
          <input
          onChange={onSort}
          list='sortOptions'
          name='sortOption'
            id='sortOption'
          />
          <datalist id='sortOptions'>
            <option>Name Descending</option>
            <option>Name Ascending</option>
            <option>Price Descending</option>
            <option>Price Ascending</option>
            <option>Time Descending</option>
            <option>Time Ascending</option>
          </datalist> */}
        </div>
        {user.isAdmin && (
          <Link to={`/game/edit`}>
            <button>Add Game</button>
          </Link>
        )}
      </div>

      {!isLoading && <GamesList games={games} />}

      <div className='page-container'>
        <Button variant='contained' onClick={() => onChangePageIdx(-1)}>
          <i className='fa-solid fa-arrow-left'></i>
        </Button>
        <span>{filterBy.pageIdx + 1}</span>
        <Button variant='contained' onClick={() => onChangePageIdx(1)}>
          <i className='fa-solid fa-arrow-right'></i>
        </Button>
      </div>
    </section>
  )
}
