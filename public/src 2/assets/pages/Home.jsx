import ps5ControllerWhite from '/ps.png'
import nintendoSwitchWhite from '/switch.png'
import xboxControllerWhite from '/xbox.png'
import ps5ControllerBlack from '/ps5Black.svg'
import nintendoSwitchBlack from '/switchBlack.svg'
import xboxControllerBlack from '/xboxBlack.svg'

import img1 from '/1.webp'
import img2 from '/2.webp'
import img3 from '/3.webp'

import SlideShow from './SlideShow.jsx'
import GamesSlideShow from './GamesSlideShow.jsx'

// import Carousel from 'react-multi-carousel'
import CustomDot from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { setFilterBy } from '../../store/actions/game.actions.js'
import { useEffect, useState } from 'react'

import { gameService } from '../../services/game.service.js'

// import '../css/Home.scss'

export function Home() {
  const filterBy = useSelector((storeState) => storeState.gameModule.filterBy)
  const navigate = useNavigate()

  const [randomGames, setRandomGames] = useState([])

  useEffect(() => {
    gameService.getRandomGames().then((games) => {
      setRandomGames(games)
      // console.log(randomGames)
    })
  }, [])

  function onSelectCompany(company) {
    setFilterBy({ ...filterBy, companies: [company], pageIdx: 0 })
    navigate(`/game`)
  }

  return (
    <section className='section-container home'>
      <h2>"Your Ultimate Destination for Gaming Excellence!"</h2>
      <SlideShow img1={img1} img2={img2} img3={img3} />

      <h4>Choose your console</h4>
      <div className='companies-container'>
        <img
          onClick={() => onSelectCompany('Sony')}
          src={ps5ControllerWhite}
          className='logo'
          alt=''
        />
        <img
          onClick={() => onSelectCompany('Nintendo')}
          src={nintendoSwitchWhite}
          className='logo'
          alt=''
        />
        <img
          onClick={() => onSelectCompany('Microsoft')}
          src={xboxControllerWhite}
          className='logo'
          alt=''
        />
      </div>
      <Link to={`/game`}>
        <h4>Our Games</h4>
      </Link>
      <GamesSlideShow randomGames={randomGames} />
    </section>
  )
}
