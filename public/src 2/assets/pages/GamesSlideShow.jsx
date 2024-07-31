import React from 'react'
import Slider from 'react-slick'
import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

function MultipleItems({ randomGames }) {
  console.log(randomGames)

  //   useEffect(() => {
  //     console.log(randomGames)
  //   }, [randomGames])

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  }
  return (
    <div className='slider-container'>
      <div className='games-card-container'>
        <Slider {...settings}>
          {/* <div className='games-card-container'> */}
          {randomGames.map((game) => {
            return (
              <Link to={`/game/${game._id}`} key={game}>
                <div className='game-card-container'>
                  <div className='title-container'>
                    <img src={game.cover} alt='' />
                    <h4>{game.name}</h4>
                  </div>
                </div>
              </Link>
            )
          })}
          {/* </div> */}
        </Slider>{' '}
      </div>
    </div>
  )
}

export default MultipleItems
