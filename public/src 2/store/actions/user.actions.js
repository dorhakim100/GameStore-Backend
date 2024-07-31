import { userService } from '../../services/user.service.js'
// import { CLEAR_gameT } from '../reducers/game.reducer.js'
import {
  ADD_GAME_TO_CART,
  CLEAR_CART,
  REMOVE_GAME_FROM_CART,
  SET_USER,
  SET_USER_SCORE,
} from '../reducers/user.reducer.js'
import { store } from '../store.js'

export function login(credentials) {
  console.log(credentials)
  return userService
    .login(credentials)
    .then((user) => {
      store.dispatch({ type: SET_USER, user })
      return user
    })
    .catch((err) => {
      console.log('user actions -> Cannot login', err)
      throw err
    })
}

export function signup(credentials) {
  return userService
    .signup(credentials)
    .then((user) => {
      store.dispatch({ type: SET_USER, user })
      return user
    })
    .catch((err) => {
      console.log('user actions -> Cannot signup', err)
      throw err
    })
}

export function logout(credentials) {
  return userService
    .logout(credentials)
    .then(() => {
      store.dispatch({ type: SET_USER, user: null })
    })
    .catch((err) => {
      console.log('user actions -> Cannot logout', err)
    })
}

export function checkout(diff) {
  return userService
    .updateScore(-diff)
    .then((newScore) => {
      store.dispatch({ type: CLEAR_CART })
      store.dispatch({ type: SET_USER_SCORE, score: newScore })
    })
    .catch((err) => {
      console.log('user actions -> Cannot checkout', err)
      throw err
    })
}

export function addGameToCart(game) {
  console.log(game)
  return userService
    .addGameToCart(game)
    .then((addedGame) => {
      console.log(addedGame)
      store.dispatch({ type: ADD_GAME_TO_CART, game })
    })
    .catch((err) => {
      console.log('user actions -> Cannot add game', err)
      throw err
    })
}

export function removeGameFromCart(gameId) {
  return userService
    .removeGameFromCart(gameId)
    .then((updatedUser) => {
      store.dispatch({ type: REMOVE_GAME_FROM_CART, updatedUser })
    })
    .catch((err) => {
      console.log('user actions -> Cannot remove game', err)
      throw err
    })
}

export function clearCart() {
  return userService
    .clearCart()
    .then((updatedUser) => {
      store.dispatch({ type: CLEAR_CART, updatedUser })
    })
    .catch((err) => {
      console.log('user actions -> Cannot clear cart', err)
      throw err
    })
}

export function checkoutStore(score) {
  console.log(score)
  return userService
    .checkout(score)
    .then((updatedUser) => {
      store.dispatch({ type: CLEAR_CART, updatedUser })
    })
    .then(() => {
      store.dispatch({ type: SET_USER_SCORE, score })
    })
    .catch((err) => {
      console.log('user actions -> Cannot checkout cart', err)
      throw err
    })
}
