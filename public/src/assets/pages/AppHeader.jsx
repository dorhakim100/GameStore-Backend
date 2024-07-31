import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Link, useNavigate, useParams } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

import { setFilterBy } from '../../store/actions/game.actions.js'
import { utilService } from '../../services/util.service.js'
import { gameService } from '../../services/game.service.js'

import { UserMsg } from './UserMsg.jsx'
import { LoginSignup } from './LoginSignup.jsx'
import { Cart } from './Cart.jsx'
import { SearchBar } from './SearchBar.jsx'
import { NavBar } from './NavBar.jsx'

import { userService } from '../../services/user.service.js'
import { login, signup, logout } from '../../store/actions/user.actions.js'

import {
  showErrorMsg,
  showSuccessMsg,
} from '../../services/event-bus.service.js'

import icon from '/game-controller.svg'
import Search from '@mui/icons-material/Search.js'

// import '../css/AppHeader.css'

export function AppHeader() {
  const navigate = useNavigate()

  const [user, setUser] = useState(userService.getLoggedinUser())
  const filterBy = useSelector(
    (storeSelector) => storeSelector.gameModule.filterBy
  )

  const [onFilterBy, setOnFilterBy] = useState(filterBy)
  const debouncedSetFilter = useRef(utilService.debounce(setOnFilterBy, 500))

  const [isCart, setIsCart] = useState(false)
  const [isLoginPage, setIsLoginPage] = useState(false)
  const [score, setScore] = useState(0)

  const storeCart = useSelector(
    (stateSelector) => stateSelector.userModule.shoppingCart
  )

  const [cartLength, setCartLength] = useState(0)

  const navBarRef = useRef()

  function onSetUser(user) {
    setUser(user)
    if (user === null) {
      navigate(`/`)
      return
    }
    setScore(user.score)
    navigate(`/`)
  }

  useEffect(() => {
    setUser(user)
    if (user === null) {
      return
    }
    setScore(user.score)
  }, [])

  function onLogout() {
    // userService
    //   .logout()
    //   .then(() => {
    //     onSetUser(null)
    //   })
    //   .catch((err) => {
    //     showErrorMsg('OOPs try again')
    //   })
    logout()
      .then(() => {
        onSetUser(null)

        showSuccessMsg('Logged out')
      })
      .catch((err) => {
        showErrorMsg('OOPs try again')
      })
  }

  function toggleNavBar() {
    if (navBarRef.current.style.display === 'flex') {
      navBarRef.current.style.display = 'none'
    } else {
      navBarRef.current.style.display = 'flex'
    }
  }

  function toggleCart() {
    if (isLoginPage)
      setIsLoginPage((prevIsLoginPage) => (prevIsLoginPage = !prevIsLoginPage))

    setIsCart((prevIsCart) => (prevIsCart = !prevIsCart))
  }
  function toggleLoginPage() {
    if (isCart) setIsCart((prevIsCart) => (prevIsCart = !prevIsCart))

    setIsLoginPage((prevIsLoginPage) => (prevIsLoginPage = !prevIsLoginPage))
  }
  return (
    <header className='app-header'>
      <section className='header-container'>
        <SearchBar
          icon={icon}
          toggleLoginPage={toggleLoginPage}
          filterBy={filterBy}
          debouncedSetFilter={debouncedSetFilter}
          navigate={navigate}
          toggleNavBar={toggleNavBar}
        />
        <nav className='app-nav'>
          <NavLink to='/'>Home</NavLink>
          <NavLink
            onClick={() => {
              event.preventDefault()
              setFilterBy(gameService.getDefaultFilter())
            }}
            to='/game'
          >
            Games
          </NavLink>
          <NavLink to='/dashboard'>Dashboard</NavLink>
          <NavLink to='/about'>About</NavLink>
        </nav>
        {user ? null : (
          <section>
            {isLoginPage && (
              <LoginSignup
                onSetUser={onSetUser}
                toggleLoginPage={toggleLoginPage}
              />
            )}
          </section>
        )}
        {(!user && (
          <button onClick={toggleLoginPage}>
            <i className='fa-solid fa-user'></i>
          </button>
        )) || (
          <section className='login-container'>
            <Link to={`/user/${user._id}`}>
              <i class='fa-solid fa-user'></i>
              <span>{user.fullname}</span>
            </Link>
            {user && <span>{score}$</span>}
            <button onClick={onLogout}>Logout</button>
          </section>
        )}
        <div className='cart-button-container'>
          <button onClick={toggleCart} className='cart-button'>
            <i className='fa-solid fa-cart-shopping'></i>
          </button>
          {storeCart.length > 0 && (
            <div className='cart-quantity'>{storeCart.length}</div>
          )}
        </div>
      </section>
      {isCart && <Cart toggleCart={toggleCart} setScore={setScore} />}
      <UserMsg />
      <NavBar
        navBarRef={navBarRef}
        toggleCart={toggleCart}
        toggleNavBar={toggleNavBar}
      />
    </header>
  )
}
