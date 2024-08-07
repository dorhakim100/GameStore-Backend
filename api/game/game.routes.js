import express from 'express'
import {
  requireAuth,
  requireAdmin,
} from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import {
  getGames,
  getGameById,
  addGame,
  updateGame,
  removeGame,
  addGameMsg,
  removeGameMsg,
} from './game.controller.js'

export const gameRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

gameRoutes.get('/', log, getGames)
// gameRoutes.get('/', getGames)
gameRoutes.get('/:id', getGameById)
gameRoutes.post('/', requireAdmin, addGame)
gameRoutes.put('/:id', requireAuth, updateGame)
gameRoutes.delete('/:id', requireAdmin, removeGame)
// router.delete('/:id', requireAuth, requireAdmin, removeGame)

gameRoutes.post('/:id/msg', requireAuth, addGameMsg)
gameRoutes.delete('/:id/msg/:msgId', requireAuth, removeGameMsg)
