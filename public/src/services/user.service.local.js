import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'

const STORAGE_KEY = 'userDB'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
  login,
  logout,
  signup,
  getLoggedinUser,
  saveLocalUser,
  query,
  getById,
  remove,
  update,
  changeScore,
  getEmptyCredentials,
  addGameToCart,
  removeGameFromCart,
  clearCart,
  checkout,
  setOrder,
}

window.userService = userService

function query() {
  // return storageService.query('user')
  return httpService.get(`user`)
}

async function getById(userId) {
  // const user = await storageService.get('user', userId)
  const user = await httpService.get(`user/${userId}`)
  return user
}
function remove(userId) {
  // return storageService.remove('user', userId)
  return httpService.delete(`user/${userId}`)
}

async function update(user) {
  // await storageService.put('user', user)
  user = await httpService.put(`user/${user._id}`, user)
  // Handle case in which admin updates other user's details
  if (getLoggedinUser()._id === user._id) saveLocalUser(user)
  return user
}

async function login(userCred) {
  // const users = await storageService.query('user')
  // const user = users.find(user => user.username === userCred.username)
  console.log(userCred)
  //   debugger
  const user = await httpService.post('auth/login', userCred)
  if (user) {
    return saveLocalUser(user)
  }
}
async function signup(userCred) {
  // userCred.score = 10000
  if (!userCred.imgUrl)
    userCred.imgUrl =
      'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
  const userToSave = {
    username: userCred.username,
    password: userCred.password,
    fullname: userCred.fullname,
    score: 9999,
    isAdmin: userCred.fullname === 'Dor Hakim' ? true : false,
    gamesInCart: [],
    orders: [],
    imgUrl: userCred.imgUrl,
  }
  // const user = await storageService.post('user', userCred)
  const user = await httpService.post('auth/signup', userToSave)
  return saveLocalUser(user)
}
async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
  return await httpService.post('auth/logout')
}

async function changeScore(by) {
  const user = getLoggedinUser()
  if (!user) throw new Error('Not loggedin')
  user.score = user.score + by || by
  await update(user)
  return user.score
}

function saveLocalUser(user) {
  //   user = {
  //     _id: user._id,
  //     fullname: user.fullname,
  //     imgUrl: user.imgUrl,
  //     score: user.score,
  //     isAdmin: user.isAdmin,
  //   }
  //   sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
  //   return user
  console.log(user)
  //   debugger
  const userToSave = {
    _id: user._id,
    fullname: user.fullname,
    score: user.score,
    isAdmin: user.isAdmin,
    gamesInCart: user.gamesInCart,
    username: user.username,
    password: user.password,
    orders: user.orders,
  }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))

  return userToSave
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

// ;(async ()=>{
//     await userService.signup({fullname: 'Puki Norma', username: 'puki', password:'123',score: 10000, isAdmin: false})
//     await userService.signup({fullname: 'Master Adminov', username: 'admin', password:'123', score: 10000, isAdmin: true})
//     await userService.signup({fullname: 'Muki G', username: 'muki', password:'123', score: 10000})
// })()

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

function _setLoggedinUser(user) {
  const userToSave = {
    _id: user._id,
    fullname: user.fullname,
    score: user.score,
    isAdmin: user.isAdmin,
    gamesInCart: user.gamesInCart,
    username: user.username,
    password: user.password,
    orders: user.orders,
  }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))

  return userToSave
}
