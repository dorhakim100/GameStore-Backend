import { ObjectId } from 'mongodb'

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export const gameService = {
  remove,
  query,
  getById,
  add,
  update,
  addGameMsg,
  removeGameMsg,
}

async function query(filterBy = { txt: '' }) {
  try {
    const criteria = {
      name: { $regex: filterBy.txt, $options: 'i' },
    }
    const collection = await dbService.getCollection('games')
    var games = await collection.find(criteria).toArray()

    return games
  } catch (err) {
    logger.error('cannot find games', err)
    throw err
  }
}

async function getById(gameId) {
  try {
    console.log(gameId)

    const collection = await dbService.getCollection('games')
    const game = await collection.findOne({
      _id: ObjectId.createFromHexString(gameId),
    })
    game.createdAt = game._id.getTimestamp()
    return game
  } catch (err) {
    logger.error(`while finding game ${gameId}`, err)
    throw err
  }
}

async function remove(gameId) {
  try {
    const collection = await dbService.getCollection('games')
    const { deletedCount } = await collection.deleteOne({
      _id: ObjectId.createFromHexString(gameId),
    })
    return deletedCount
  } catch (err) {
    logger.error(`cannot remove game ${gameId}`, err)
    throw err
  }
}

async function add(game) {
  try {
    const collection = await dbService.getCollection('games')
    await collection.insertOne(game)
    return game
  } catch (err) {
    logger.error('cannot insert game', err)
    throw err
  }
}

async function update(game) {
  try {
    const gameToSave = {
      name: game.name,
      price: game.price,
      labels: game.labels,
      inStock: game.inStock,
      companies: game.companies,
      cover: game.cover,
      preview: game.preview,
    }
    const collection = await dbService.getCollection('games')
    await collection.updateOne(
      { _id: ObjectId.createFromHexString(game._id) },
      { $set: gameToSave }
    )
    return game
  } catch (err) {
    logger.error(`cannot update game ${game._id}`, err)
    throw err
  }
}

async function addGameMsg(gameId, msg) {
  try {
    msg.id = utilService.makeId()

    const collection = await dbService.getCollection('game')
    await collection.updateOne(
      { _id: ObjectId.createFromHexString(gameId) },
      { $push: { msgs: msg } }
    )
    return msg
  } catch (err) {
    logger.error(`cannot add game msg ${gameId}`, err)
    throw err
  }
}

async function removeGameMsg(gameId, msgId) {
  try {
    const collection = await dbService.getCollection('game')
    await collection.updateOne(
      { _id: ObjectId.createFromHexString(gameId) },
      { $pull: { msgs: { id: msgId } } }
    )
    return msgId
  } catch (err) {
    logger.error(`cannot add game msg ${gameId}`, err)
    throw err
  }
}
