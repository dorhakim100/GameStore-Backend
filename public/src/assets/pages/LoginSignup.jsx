import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { login, signup, logout } from '../../store/actions/user.actions.js'
import { userService } from '../../services/user.service.js'

import { showErrorMsg } from '../../services/event-bus.service.js'
import { showSuccessMsg } from '../../services/event-bus.service.js'

import { MyForm } from './MyForm.jsx'

// import '../css/LoginSignun.css'

export function LoginSignup({ onSetUser, toggleLoginPage }) {
  const user = useSelector((storeState) => storeState.userModule.loggedInUser)

  const [isSignup, setIsSignUp] = useState(user)
  const [credentials, setCredentials] = useState(
    userService.getEmptyCredentials()
  )

  const navigate = useNavigate()

  function handleChange({ target }) {
    const { name: field, value } = target
    setCredentials((prevCreds) => ({ ...prevCreds, [field]: value }))
  }

  function handleChange({ target }) {
    const { name: field, value } = target
    setCredentials((prevCreds) => ({ ...prevCreds, [field]: value }))
  }

  function handleSubmit(ev) {
    console.log(credentials)
    ev.preventDefault()
    onLogin(credentials)
  }
  function onLogin(credentials) {
    isSignup
      ? signup(credentials)
          .then((loggedinUser) => {
            console.log(loggedinUser)

            onSetUser(loggedinUser)
            // navigate('/game')
          })
          .then(() => {
            showSuccessMsg('Signed in successfully')
          })
          .catch((err) => {
            showErrorMsg('Oops try again')
          })
      : login(credentials)
          .then((data) => {
            onSetUser(data)
            showSuccessMsg('Logged in successfully')
          })
          .catch((err) => {
            showErrorMsg('Oops try again')
          })
  }

  return (
    <div className='login-page'>
      <button onClick={toggleLoginPage}>
        <i className='fa-solid fa-x'></i>
      </button>
      {/* <MyForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isSignup={isSignup}
      /> */}
      <form className='login-form' onSubmit={handleSubmit}>
        <input
          type='text'
          name='username'
          value={credentials.username}
          placeholder='Username'
          onChange={handleChange}
          required
          autoFocus
        />
        <input
          type='password'
          name='password'
          value={credentials.password}
          placeholder='Password'
          onChange={handleChange}
          required
          autoComplete='off'
        />
        {isSignup && (
          <input
            type='text'
            name='fullname'
            value={credentials.fullname}
            placeholder='Full name'
            onChange={handleChange}
            required
          />
        )}
        <button>{isSignup ? 'Signup' : 'Login'}</button>
      </form>

      <div className='btns'>
        <a
          href='#'
          onClick={() => setIsSignUp(!isSignup)}
          style={{ padding: '15px' }}
        >
          {isSignup ? 'Already a member? Login' : 'New user? Signup here'}
        </a>
      </div>
    </div>
  )
}
