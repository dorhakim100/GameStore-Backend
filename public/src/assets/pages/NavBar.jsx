import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Link, useNavigate, useParams } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

import { Button } from '@mui/material'

import { setFilterBy } from '../../store/actions/game.actions.js'
import { utilService } from '../../services/util.service.js'
import { gameService } from '../../services/game.service.js'
import { userService } from '../../services/user.service.js'

export function NavBar({ navBarRef, toggleCart, toggleNavBar }) {
  const [user, setUser] = useState(userService.getLoggedinUser())

  return (
    <div className='nav-bar-container' ref={navBarRef}>
      <nav className='app-nav'>
        <NavLink
          onClick={() => {
            event.preventDefault()

            toggleNavBar()
          }}
          to='/'
        >
          Home
        </NavLink>
        <NavLink
          onClick={() => {
            event.preventDefault()
            setFilterBy(gameService.getDefaultFilter())
            toggleNavBar()
          }}
          to='/game'
        >
          Games
        </NavLink>
        <NavLink
          onClick={() => {
            event.preventDefault()

            toggleNavBar()
          }}
          to='/dashboard'
        >
          Dashboard
        </NavLink>
        <NavLink
          onClick={() => {
            event.preventDefault()

            toggleNavBar()
          }}
          to='/about'
        >
          About
        </NavLink>
        {user && (
          <NavLink
            onClick={() => {
              event.preventDefault()

              toggleNavBar()
            }}
            to={`/user/${user._id}`}
          >
            My Account
          </NavLink>
        )}
        <Button
          variant='contained'
          onClick={() => {
            toggleCart()
            toggleNavBar()
          }}
        >
          Cart
        </Button>
      </nav>
    </div>
  )
}
