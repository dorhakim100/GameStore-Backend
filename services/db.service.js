import { MongoClient } from 'mongodb'

import { config } from '../config/index.js'
import { log } from 'console'

export const dbService = {
  getCollection,
}

var dbConn = null

async function getCollection(collectionName) {
  try {
    // console.log('works')
    const db = await _connect()
    const collection = await db.collection(collectionName)
    const games = await collection.find({})
    // console.log(games)
    return collection
  } catch (err) {
    logger.error('Failed to get Mongo collection', err)
    throw err
  }
}

async function _connect() {
  if (dbConn) return dbConn
  try {
    // const client = await MongoClient.connect(config.dbURL, { useUnifiedTopology: true })
    const client = await MongoClient.connect(config.dbURL)
    const db = client.db(config.dbName)
    dbConn = db

    return db
  } catch (err) {
    logger.error('Cannot Connect to DB', err)
    throw err
  }
}
