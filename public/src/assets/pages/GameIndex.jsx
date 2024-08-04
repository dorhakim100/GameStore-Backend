import { useDispatch, useSelector } from 'react-redux'
// import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { Button, Autocomplete, TextField } from '@mui/material'
import { Loader, Placeholder } from 'rsuite'

import { useEffect, useState, useRef } from 'react'

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
import { showInfoMsg } from '../../services/event-bus.service.js'

import gameCover from '/game-cover.jpg'
import sony1 from '/sony1.jpg'
import sony2 from '/sony2.jpg'
import nintendo1 from '/nintendo1.jpg'
import nintendo2 from '/nintendo2.jpg'
import microsoft1 from '/microsoft1.jpg'
import microsoft2 from '/microsoft2.jpg'
import controllersCover from '/3.jpg'
import psVideo from '/default.mp4'
import xboxVideo from '/xboxVideo.mp4'
import switchVideo from '/switchVideo.mp4'
import spiderManVideo from '/spider-man_video.mp4'
import godOfWarVideo from '/godOfWarVideo.mp4'
import pokemonVideo from '/pokemonVideo.mp4'
import zeldaVideo from '/zeldaVideo.mp4'
import haloVideo from '/haloVideo.mp4'
import redfallVideo from '/redfallVideo.mp4'
import loader from '/loader.svg'

// import '../css/GameIndex.css'
import { gameService } from '../../services/game.service.js'
import { userService } from '../../services/user.service.js'

export function GameIndex() {
  let games = useSelector((storeState) => storeState.gameModule.games)
  const isLoading = useSelector((storeState) => storeState.gameModule.isLoading)
  const filterBy = useSelector((storeState) => storeState.gameModule.filterBy)

  const [user, setUser] = useState(userService.getLoggedinUser() || {})
  const [video, setVideo] = useState(psVideo)

  const videoRef = useRef()

  useEffect(() => {
    setCompanyVideo()
    // setIsLoadingTrue()
    setTimeout(() => {
      loadGames().then((games) => {
        console.log(games)
        if (games.length === 0) {
          setTimeout(() => {
            setFilterBy(gameService.getDefaultFilter())
            setIsLoadingFalse()
            showErrorMsg(`Couldn't find games`)
          }, 2000)
        }
      })
    }, 500)
  }, [filterBy])

  function onSetFilter(filterBy) {
    setFilterBy(filterBy)
  }

  function setCompanyVideo() {
    if (
      filterBy.companies[0] === 'Sony' &&
      filterBy.companies.length === 1 &&
      filterBy.txt === ''
    )
      videoRef.current.src = psVideo
    if (
      filterBy.companies[0] === 'Nintendo' &&
      filterBy.companies.length === 1 &&
      filterBy.txt === ''
    )
      videoRef.current.src = switchVideo
    if (
      filterBy.companies[0] === 'Microsoft' &&
      filterBy.companies.length === 1 &&
      filterBy.txt === ''
    )
      videoRef.current.src = xboxVideo
  }

  function onChangePageIdx(diff) {
    if (filterBy.pageIdx === 0 && diff === -1) {
      // showInfoMsg('')

      return
    }

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
      if (maxPage === 1) {
        showInfoMsg('No more games')
        return
      }
      setIsLoadingTrue()
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

  // function onSort(ev, value) {
  //   const newSortBy = value.replace(' ', '')

  //   setFilterBy({ ...filterBy, sortBy: newSortBy, pageIdx: 0 })
  // }

  function onClickOnCover(game) {
    console.log(game)
    const filterToSet = gameService.getDefaultFilter()
    switch (game) {
      case 'Spider-Man':
        videoRef.current.src = spiderManVideo
        setTimeout(
          () => setFilterBy({ ...filterToSet, txt: game, companies: ['Sony'] }),
          300
        )
        break
      case 'God of War':
        videoRef.current.src = godOfWarVideo
        setTimeout(
          () => setFilterBy({ ...filterToSet, txt: game, companies: ['Sony'] }),
          300
        )

        break
      case 'Pokemon':
        videoRef.current.src = pokemonVideo
        setTimeout(
          () =>
            setFilterBy({ ...filterToSet, txt: game, companies: ['Nintendo'] }),
          300
        )

        break
      case 'Zelda':
        videoRef.current.src = zeldaVideo
        setTimeout(
          () =>
            setFilterBy({ ...filterToSet, txt: game, companies: ['Nintendo'] }),
          300
        )

        break
      case 'Halo':
        videoRef.current.src = haloVideo
        setTimeout(
          () =>
            setFilterBy({
              ...filterToSet,
              txt: game,
              companies: ['Microsoft'],
            }),
          300
        )

        break
      case 'Redfall':
        videoRef.current.src = redfallVideo
        setTimeout(
          () =>
            setFilterBy({
              ...filterToSet,
              txt: game,
              companies: ['Microsoft'],
            }),
          300
        )

        break

      default:
        break
    }
    console.log(video)
    window.scrollTo({ top: 750, behavior: 'smooth' })
    // navigate(`/game`)
  }

  return (
    <section className='section-container game-index'>
      {isLoading && (
        <div className='loader'>
          <img src={loader} alt='' />
        </div>
      )}

      {filterBy.companies[0] === 'Sony' && filterBy.companies.length === 1 && (
        <div className='company-header-container playstation-header'>
          <h2 className='console-header'>Playstation</h2>
          <i className='fa-brands fa-playstation'></i>
        </div>
      )}
      {filterBy.companies[0] === 'Nintendo' &&
        filterBy.companies.length === 1 && (
          <div className='company-header-container switch-header'>
            <h2 className='console-header'>Switch</h2>
            <svg
              fill='#ffffff'
              width='85px'
              height='85px'
              viewBox='-3.2 -3.2 38.40 38.40'
              xmlns='http://www.w3.org/2000/svg'
              transform='rotate(0)matrix(1, 0, 0, 1, 0, 0)'
              stroke='#ffffff'
              stroke-width='0.00032'
            >
              <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
              <g
                id='SVGRepo_tracerCarrier'
                stroke-linecap='round'
                stroke-linejoin='round'
              ></g>
              <g id='SVGRepo_iconCarrier'>
                {' '}
                <path d='M18.901 32h4.901c4.5 0 8.198-3.698 8.198-8.198v-15.604c0-4.5-3.698-8.198-8.198-8.198h-5c-0.099 0-0.203 0.099-0.203 0.198v31.604c0 0.099 0.099 0.198 0.302 0.198zM25 14.401c1.802 0 3.198 1.5 3.198 3.198 0 1.802-1.5 3.198-3.198 3.198-1.802 0-3.198-1.396-3.198-3.198-0.104-1.797 1.396-3.198 3.198-3.198zM15.198 0h-7c-4.5 0-8.198 3.698-8.198 8.198v15.604c0 4.5 3.698 8.198 8.198 8.198h7c0.099 0 0.203-0.099 0.203-0.198v-31.604c0-0.099-0.099-0.198-0.203-0.198zM12.901 29.401h-4.703c-3.099 0-5.599-2.5-5.599-5.599v-15.604c0-3.099 2.5-5.599 5.599-5.599h4.604zM5 9.599c0 1.698 1.302 3 3 3s3-1.302 3-3c0-1.698-1.302-3-3-3s-3 1.302-3 3z'></path>{' '}
              </g>
            </svg>
          </div>
        )}
      {filterBy.companies[0] === 'Microsoft' &&
        filterBy.companies.length === 1 && (
          <div className='company-header-container xbox-header'>
            <h2 className='console-header'>Xbox</h2>
            <i className='fa-brands fa-xbox'></i>{' '}
          </div>
        )}
      {filterBy.companies.length !== 1 && (
        <div className='company-header-container main-header'>
          <h2 className='console-header'>Our games</h2>
          <i className='fa-solid fa-gamepad'></i>{' '}
        </div>
      )}
      <div className='imgs-container game-index'>
        {filterBy.companies[0] === 'Sony' &&
          filterBy.companies.length === 1 && (
            <>
              <img
                style={{ cursor: 'pointer' }}
                src={sony1}
                alt=''
                onClick={() => onClickOnCover('Spider-Man')}
              />
              <img
                style={{ cursor: 'pointer' }}
                src={sony2}
                alt=''
                onClick={() => onClickOnCover('God of War')}
              />
            </>
          )}
        {filterBy.companies[0] === 'Nintendo' &&
          filterBy.companies.length === 1 && (
            <>
              <img
                style={{ cursor: 'pointer' }}
                src={nintendo1}
                alt=''
                onClick={() => onClickOnCover('Zelda')}
              />
              <img
                style={{ cursor: 'pointer' }}
                src={nintendo2}
                alt=''
                onClick={() => onClickOnCover('Pokemon')}
              />
            </>
          )}
        {filterBy.companies[0] === 'Microsoft' &&
          filterBy.companies.length === 1 && (
            <>
              <img
                style={{ cursor: 'pointer' }}
                src={microsoft1}
                alt=''
                onClick={() => onClickOnCover('Halo')}
              />
              <img
                style={{ cursor: 'pointer' }}
                src={microsoft2}
                alt=''
                onClick={() => onClickOnCover('Redfall')}
              />
            </>
          )}
        {filterBy.companies.length !== 1 && (
          <>
            <img
              style={{ cursor: 'pointer' }}
              src={sony1}
              alt=''
              onClick={() => onClickOnCover('Spider-Man')}
            />
            <img
              style={{ cursor: 'pointer' }}
              src={nintendo2}
              alt=''
              onClick={() => onClickOnCover('Pokemon')}
            />
          </>
        )}
        {/*  */}
        <video
          ref={videoRef}
          className='video'
          width='100%'
          height='100%'
          // controls
          // className='videoTag'
          autoPlay
          loop
          muted
        >
          <source src={video} type='video/mp4' />
        </video>
        {/* 
        {(video !== controllersCover && (
          <video
            ref={videoRef}
            className='controllers-cover'
            width='100%'
            height='100%'
            // controls
            // className='videoTag'
            autoPlay
            loop
            muted
          >
            <source src={video} type='video/mp4' />
          </video>
        )) || (
          <img className='controllers-cover' src={controllersCover} alt='' />
        )} */}
      </div>
      <div className='game-index-user-interface'>
        {/* <div className='user-buttons-container'> */}
        <GameFilter
          filterBy={filterBy}
          onSetFilter={(event, value) => onSetFilter(ev, value)}
        />{' '}
        {user.isAdmin && (
          <Link to={`/game/edit`}>
            <Button variant='contained'>Add Game</Button>
          </Link>
        )}
        {/* </div> */}
        {/* <div className='page-container'> */}
        <span className='page-idx'>{filterBy.pageIdx + 1}</span>
        <div className='buttons-container'>
          <Button
            variant='contained'
            disabled={filterBy.pageIdx === 0 ? true : false}
            onClick={() => onChangePageIdx(-1)}
          >
            <i className='fa-solid fa-arrow-left'></i>
          </Button>

          <Button variant='contained' onClick={() => onChangePageIdx(1)}>
            <i className='fa-solid fa-arrow-right'></i>
          </Button>
        </div>
        {/* </div> */}
      </div>
      {/* <h2>My Games</h2> */}

      {/* <div className='sort-container'>
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
        </div> */}

      {<GamesList games={games} />}
    </section>
  )
}
