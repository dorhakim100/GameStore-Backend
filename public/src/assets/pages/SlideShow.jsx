import React from 'react'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

function SimpleSlider({ img1, img2, img3 }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }
  return (
    <div className='slider-container'>
      <Slider {...settings}>
        <div>
          <img src={img1} alt='' />
        </div>
        <div>
          <img src={img2} alt='' />
        </div>
        <div>
          <img src={img3} alt='' />
        </div>
      </Slider>
    </div>
  )
}

export default SimpleSlider
