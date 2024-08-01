// import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'game'
const PAGE_SIZE = 6

export const gameService = {
  query,
  getById,
  save,
  remove,
  getEmptyGame,
  addGameMsg,
  getDefaultFilter,
  getMaxPage,
  getRandomGames,
}
window.cs = gameService

async function query(filterBy = { txt: '', price: 0 }) {
  return httpService.get(STORAGE_KEY, filterBy)

  // var games = await storageService.query(STORAGE_KEY)
  // if (filterBy.txt) {
  //     const regex = new RegExp(filterBy.txt, 'i')
  //     games = games.filter(game => regex.test(game.vendor) || regex.test(game.description))
  // }
  // if (filterBy.price) {
  //     games = games.filter(game => game.price <= filterBy.price)
  // }
  // return games
}
function getById(gameId) {
  console.log(gameId)
  // return storageService.get(STORAGE_KEY, gameId)
  return httpService.get(`game/${gameId}`)
}

async function remove(gameId) {
  // await storageService.remove(STORAGE_KEY, gameId)
  return httpService.delete(`game/${gameId}`)
}
async function save(game) {
  var savedGame
  if (game._id) {
    // savedGame = await storageService.put(STORAGE_KEY, game)
    savedGame = await httpService.put(`game/${game._id}`, game)
  } else {
    // Later, owner is set by the backend
    // game.owner = userService.getLoggedinUser()
    // savedGame = await storageService.post(STORAGE_KEY, game)
    savedGame = await httpService.post('game', game)
  }
  return savedGame
}

async function addGameMsg(gameId, txt) {
  // const game = await getById(gameId)
  // if (!game.msgs) game.msgs = []

  // const msg = {
  //     id: utilService.makeId(),
  //     by: userService.getLoggedinUser(),
  //     txt
  // }
  // game.msgs.push(msg)
  // await storageService.put(STORAGE_KEY, game)
  const savedMsg = await httpService.post(`game/${gameId}/msg`, { txt })
  return savedMsg
}

function getEmptyGame() {
  return {
    vendor: 'Susita-' + (Date.now() % 1000),
    price: utilService.getRandomIntInclusive(1000, 9000),
  }
}
function getDefaultFilter() {
  return {
    txt: '',
    maxPrice: '',
    labels: [],
    inStock: 'all',
    companies: [],
    sortBy: '',
    pageIdx: 0,
  }
}

function getMaxPage(filterBy) {
  const filterToSet = { ...filterBy, pageIdx: undefined }
  // return query(filterToSet).then((games) => {
  //   const gamesLength = games.length
  //   const maxPage = Math.ceil(gamesLength / PAGE_SIZE)
  //   return maxPage
  // })
  return query(filterToSet).then((games) => {
    console.log(games)
    const gamesLength = games.length
    const maxPage = Math.ceil(gamesLength / PAGE_SIZE)
    console.log(maxPage)
    return maxPage
  })
}

function getRandomGames() {
  const randomGames = []
  return query({ isAll: true }).then((games) => {
    for (let i = 0; i < 12; i++) {
      const currIdx = utilService.getRandomIntInclusive(0, 35)
      randomGames.push(games[currIdx])
    }
    return randomGames
  })
}
