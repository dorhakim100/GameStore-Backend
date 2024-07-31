import { GoogleMap } from './GoogleMap.jsx'
import { AboutPreview } from './AboutPreview.jsx'

import { Link, useNavigate, Outlet } from 'react-router-dom'
import { useState } from 'react'

import { Button } from '@mui/material'

// import '../css/about.scss'

export function About() {
  return (
    <section className='section-container about'>
      <h2>About Us</h2>
      <h3>"Your Ultimate Destination for Gaming Excellence!"</h3>
      <div className='about-container'>
        <div className='imgs-container'>
          <img
            className='store-img'
            src='https://media.king5.com/assets/CCT/images/0a9c22e8-c93b-4196-a87a-6529dceb078d/0a9c22e8-c93b-4196-a87a-6529dceb078d_750x422.jpg'
            alt=''
          />
          <h4>Tel Aviv</h4>
          <img
            className='store-img'
            src='https://i0.wp.com/blogs.cfainstitute.org/investor/files/2021/04/GameStop-Artificial-Intelligence-Social-Media-Future-of-Investing.jpg?resize=940%2C575&ssl=1'
            alt=''
          />
          <h4>Herzeliya</h4>
          <img
            className='store-img'
            src='https://media.npr.org/assets/img/2022/03/30/gettyimages-1357928341-9ff4a3ac82452f6ac05467b0ebaa782c702c5bf5.jpg'
            alt=''
          />
          <h4>Jerusalem</h4>
        </div>

        <div className='preview-container'>
          <h3>Who we are?</h3>
          <nav className='about-nav-container'>
            <Link replace to='/about/team'>
              Team
            </Link>
            <Link replace to='/about/vision'>
              Vision
            </Link>
          </nav>
          <Outlet />
        </div>
        <div className='map-container'>
          <h3>Visit us</h3>

          <GoogleMap />
        </div>
      </div>
    </section>
  )
}
