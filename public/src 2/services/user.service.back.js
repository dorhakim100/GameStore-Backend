import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'

const BASE_URL = 'auth/'
const STORAGE_KEY = 'userDB'
const STORAGE_KEY_LOGGEDIN = 'loggedinUser'

export const userService = {
  login,
  logout,
  signup,
  getById,
  getLoggedinUser,
  updateScore,
  getEmptyCredentials,
  addGameToCart,
  removeGameFromCart,
  clearCart,
  checkout,
  setOrder,
}

function login({ username, password }) {
  return httpService
    .post(BASE_URL + 'login', { username, password })
    .then((user) => {
      if (user) return _setLoggedinUser(user)
      else return Promise.reject('Invalid login')
    })
}

function signup({ username, password, fullname }) {
  const user = { username, password, fullname, score: 10000 }
  return httpService.post(BASE_URL + 'signup', user).then((user) => {
    if (user) return _setLoggedinUser(user)
    else return Promise.reject('Invalid signup')
  })
}

function logout() {
  return httpService.post(BASE_URL + 'logout').then(() => {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
  })
}

function updateScore(diff) {
  if (getLoggedinUser().score + diff < 0) return Promise.reject('No credit')
  return httpService.put('user/', { diff }).then((user) => {
    _setLoggedinUser(user)
    return user.score
  })
}

function getById(userId) {
  return httpService.get('user/' + userId)
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function _setLoggedinUser(user) {
  const userToSave = {
    _id: user._id,
    fullname: user.fullname,
    score: user.score,
  }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
  return userToSave
}

function getEmptyCredentials() {
  return {
    username: '',
    password: '',
    fullname: '',
  }
}

function addGameToCart(gameToAdd) {
  const user = getLoggedinUser()

  user.gamesInCart.push(gameToAdd)

  _setLoggedinUser({ ...user })

  return storageService
    .put(STORAGE_KEY, { ...user, gamesInCart: [...user.gamesInCart] })
    .then(() => {
      return Promise.resolve(gameToAdd)
    })
}

function removeGameFromCart(gameId) {
  let user = getLoggedinUser()

  user.gamesInCart = user.gamesInCart.filter((game) => game._id !== gameId)

  _setLoggedinUser({ ...user })
  return storageService
    .put(STORAGE_KEY, { ...user, gamesInCart: [...user.gamesInCart] })
    .then((updatedUser) => {
      return Promise.resolve(updatedUser)
    })
}

function clearCart() {
  let user = getLoggedinUser()
  _setLoggedinUser({ ...user, gamesInCart: [] })
  return storageService
    .put(STORAGE_KEY, { ...user, gamesInCart: [] })
    .then((updatedUser) => {
      return Promise.resolve(updatedUser)
    })
}

function checkout(newScore) {
  let user = getLoggedinUser()
  const newUser = _setLoggedinUser({
    ...user,
    gamesInCart: [],
    score: newScore,
  })

  return storageService
    .put(STORAGE_KEY, { ...user, gamesInCart: [], score: newScore })
    .then((updatedUser) => {
      return Promise.resolve(updatedUser)
    })
}

function setOrder(newOrder) {
  let user = getLoggedinUser()
  user.orders.push(newOrder)
  const newUser = _setLoggedinUser({
    ...user,
  })
  return storageService.put(STORAGE_KEY, { ...user }).then((updatedUser) => {
    return Promise.resolve(updatedUser)
  })
}

// Test Data
// userService.signup({username: 'bobo', password: 'bobo', fullname: 'Bobo McPopo'})
// userService.login({username: 'bobo', password: 'bobo'})
