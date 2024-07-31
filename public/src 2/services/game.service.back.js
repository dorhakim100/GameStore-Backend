import { utilService } from './util.service.js'
import { httpService } from './http.service.js'

const BASE_URL = 'game/'
const PAGE_SIZE = 6

export const gameService = {
  query,
  getById,
  save,
  remove,
  getEmptygame,
  getDefaultFilter,
  getMaxPage,
  getRandomGames,
}

function query(filterBy = {}) {
  return httpService.get(BASE_URL, filterBy)
  // if (!filterBy.txt) filterBy.txt = ''
  // if (!filterBy.maxPrice) filterBy.maxPrice = Infinity
  // const regExp = new RegExp(filterBy.txt, 'i')
  // return storageService.query(STORAGE_KEY)
  //     .then(games => {
  //         return games.filter(game =>
  //             regExp.test(game.vendor) &&
  //             game.price <= filterBy.maxPrice
  //         )
  //     })
}

function getById(gameId) {
  return httpService.get(BASE_URL + gameId)
}
function remove(gameId) {
  return httpService.delete(BASE_URL + gameId)
}

function save(game) {
  if (game._id) {
    return httpService.put(BASE_URL, game)
  } else {
    return httpService.post(BASE_URL, game)
  }
}

function getEmptygame() {
  return {
    name: '' + (Date.now() % 1000),
    price: utilService.getRandomIntInclusive(1000, 9000),
    // speed: utilService.getRandomIntInclusive(75, 200),
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

function getMaxPage() {
  return query().then((games) => {
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
