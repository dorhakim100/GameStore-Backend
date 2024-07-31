import { ObjectId } from 'mongodb'
import { dbService } from './db.service.js'

import fs from 'fs'
import { utilService } from './util.service.js'

const PAGE_SIZE = 6
const games = utilService.readJsonFile('data/game.json')

export const gameService = {
  query,
  get,
  remove,
  save,
}

// query({ txt: 'pok' })

async function query(filterBy = {}) {
  if (filterBy.isAll) return Promise.resolve(games)

  const criteria = {}

  let { inStock, pageIdx } = filterBy
  const pageIdxInteger = +pageIdx

  if (pageIdx !== undefined) {
  }
  let inStockBole
  inStockBole = inStock === 'all' ? true : false

  let filteredGames = games
  if (filterBy.txt) {
    const regExp = new RegExp(filterBy.txt, 'i')
    // filteredGames = filteredGames.filter((game) => regExp.test(game.name))
    criteria.name = { $regex: regExp }
  }
  if (filterBy.maxPrice) {
    const maxPriceInte = +filterBy.maxPrice
    // filteredGames = filteredGames.filter((game) => game.price <= maxPriceInte)
    criteria.price = { $gte: maxPriceInte }
  }
  if (!inStockBole) {
    // filteredGames = filteredGames.filter(
    //   (game) => !game.inStock === JSON.parse(inStockBole)
    // )
    criteria.inStock = inStockBole
  }
  if (filterBy.labels && filterBy.labels.length) {
    criteria.labels = filterBy.labels
    // filteredGames = filteredGames.filter(
    //   (game) => filterBy.labels.every((label) => game.labels.includes(label))
    //   // filterBy.labels.some(label => toy.labels.includes(label))
    // )
  }
  if (filterBy.companies) {
    criteria.companies = filterBy.companies
    // filteredGames = filteredGames.filter((game) =>
    // filterBy.companies.every((company) => game.companies.includes(company))
    // )
  }
  if (filterBy.sortBy) {
    let sortDirection
    let type
    if (filterBy.sortBy === 'NameDescending') {
      sortDirection = 1
      type = 'name'
    } else if (filterBy.sortBy === 'NameAscending') {
      sortDirection = -1
      type = 'name'
    } else if (filterBy.sortBy === 'PriceDescending') {
      sortDirection = -1
      type = 'price'
    } else if (filterBy.sortBy === 'PriceAscending') {
      sortDirection = 1
      type = 'price'
    } else if (filterBy.sortBy === 'TimeDescending') {
      sortDirection = -1
      type = 'createdAt'
    } else if (filterBy.sortBy === 'TimeAscending') {
      sortDirection = 1
      type = 'createdAt'
    }
    // filteredGames = filteredGames.sort((game1, game2) => {
    //   if (type === 'name') {
    //     return game1.name.localeCompare(game2.name) * sortDirection
    //   } else if (type === 'price' || type === 'createdAt') {
    //     return (game1[type] - game2[type]) * sortDirection
    //   }
    // })
    criteria.sortBy = { type: type, direction: sortDirection }
  }
  if (pageIdx !== undefined) {
    let startIdx = pageIdxInteger * PAGE_SIZE
    filteredGames = filteredGames.slice(startIdx, startIdx + PAGE_SIZE)
  }

  const sort = {}
  const collation = {}
  const client = await MongoClient.connect('mongodb://localhost:27017/')
  const coll = client.db('GameStore').collection('games')
  const cursor = coll.find(criteria, { sort, collation })
  const result = await cursor.toArray()
  await client.close()
  console.log(result)
  //   return Promise.resolve(filteredGames)
}

function get(gameId) {
  const game = games.find((game) => game._id === gameId)
  if (!game) return Promise.reject('Game not found')
  return Promise.resolve(game)
}

function remove(gameId) {
  const idx = games.findIndex((game) => game._id === gameId)
  if (idx === -1) return Promise.reject('No such game')
  games.splice(idx, 1)
  return _saveGamesToFile()
}

function save(game) {
  if (game._id) {
    const idx = games.findIndex((currGame) => currGame._id === game._id)
    games[idx] = { ...games[idx], ...game }
  } else {
    game._id = _makeId()
    game.createdAt = Date.now()
    game.inStock = true
    games.unshift(game)
  }
  return _saveGamesToFile().then(() => game)
}

function _makeId(length = 5) {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

function _saveGamesToFile() {
  return new Promise((resolve, reject) => {
    const gamesStr = JSON.stringify(games, null, 4)
    fs.writeFile('data/game.json', gamesStr, (err) => {
      if (err) {
        return console.log(err)
      }
      resolve()
    })
  })
}
