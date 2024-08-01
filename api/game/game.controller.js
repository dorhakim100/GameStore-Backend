import { gameService } from './game.service.js'
import { logger } from '../../services/logger.service.js'

export async function getGames(req, res) {
  console.log(req.query)
  try {
    const { txt, maxPrice, inStock, companies, sortBy, pageIdx, labels } =
      req.query
    const filterBy = {
      txt: txt || '',
      maxPrice: maxPrice || '',
      inStock: inStock || 'all',
      companies: companies || [],
      labels: labels || [],
      sortBy: sortBy || '',
      pageIdx: pageIdx,
    }
    const games = await gameService.query(filterBy)

    res.json(games)
  } catch (err) {
    logger.error('Failed to get games', err)
    res.status(500).send({ err: 'Failed to get games' })
  }
}

export async function getGameById(req, res) {
  try {
    const gameId = req.params.id
    console.log(gameId)
    const game = await gameService.getById(gameId)
    res.json(game)
  } catch (err) {
    logger.error('Failed to get game', err)
    res.status(500).send({ err: 'Failed to get game' })
  }
}

export async function addGame(req, res) {
  const { loggedinUser } = req

  try {
    const game = req.body
    game.owner = loggedinUser
    if (!game.reviews) game.reviews = []
    const addedGame = await gameService.add(game)
    res.json(addedGame)
  } catch (err) {
    logger.error('Failed to add game', err)
    res.status(500).send({ err: 'Failed to add game' })
  }
}

export async function updateGame(req, res) {
  try {
    console.log('req: ', req.body)
    const game = req.body
    const updatedGame = await gameService.update(game)
    res.json(updatedGame)
  } catch (err) {
    logger.error('Failed to update game', err)
    res.status(500).send({ err: 'Failed to update game' })
  }
}

export async function removeGame(req, res) {
  try {
    const gameId = req.params.id
    const deletedCount = await gameService.remove(gameId)
    res.send(`${deletedCount} games removed`)
  } catch (err) {
    logger.error('Failed to remove game', err)
    res.status(500).send({ err: 'Failed to remove game' })
  }
}

export async function addGameMsg(req, res) {
  const { loggedinUser } = req
  try {
    const gameId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser,
      createdAt: Date.now(),
    }
    const savedMsg = await gameService.addGameMsg(gameId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update game', err)
    res.status(500).send({ err: 'Failed to update game' })
  }
}

export async function removeGameMsg(req, res) {
  try {
    const { gameId, msgId } = req.params

    const removedId = await gameService.removeGameMsg(gameId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove game msg', err)
    res.status(500).send({ err: 'Failed to remove game msg' })
  }
}
