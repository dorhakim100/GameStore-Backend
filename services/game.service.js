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
