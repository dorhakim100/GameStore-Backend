import { gameService } from '../../services/game.service.js'
// import { gameService } from 'src/services/game.service.js'
import { showSuccessMsg } from '../../services/event-bus.service.js'
import {
  ADD_GAME,
  GAME_UNDO,
  REMOVE_GAME,
  SET_GAMES,
  SET_FILTER_BY,
  SET_IS_LOADING,
  UPDATE_GAME,
} from '../reducers/game.reducer.js'
import { store } from '../store.js'

export function loadGames() {
  const filterBy = store.getState().gameModule.filterBy
  console.log(filterBy)
  store.dispatch({ type: SET_IS_LOADING, isLoading: true })
  return gameService
    .query(filterBy)
    .then((games) => {
      store.dispatch({ type: SET_GAMES, games })
    })
    .catch((err) => {
      console.log('game action -> Cannot load games', err)
      throw err
    })
    .finally(() => {
      store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    })
}

export function removeGame(gameId) {
  return gameService
    .remove(gameId)
    .then(() => {
      store.dispatch({ type: REMOVE_GAME, gameId })
    })
    .catch((err) => {
      console.log('game action -> Cannot remove game', err)
      throw err
    })
}

export function removeGameOptimistic(gameId) {
  store.dispatch({ type: REMOVE_GAME, gameId })
  return gameService
    .remove(gameId)
    .then(() => {
      showSuccessMsg('Removed game!')
    })
    .catch((err) => {
      store.dispatch({ type: GAME_UNDO })
      console.log('game action -> Cannot remove game', err)
      throw err
    })
}

export function saveGame(game) {
  const type = game._id ? UPDATE_GAME : ADD_GAME
  return gameService
    .save(game)
    .then((savedGame) => {
      store.dispatch({ type, game: savedGame })
      return savedGame
    })
    .catch((err) => {
      console.log('game action -> Cannot save game', err)
      throw err
    })
}

export function setFilterBy(filterBy) {
  store.dispatch({ type: SET_FILTER_BY, filterBy })
  store.dispatch({ type: SET_IS_LOADING, isLoading: true })
}

export function setIsLoadingFalse(isLoading) {
  store.dispatch({ type: SET_IS_LOADING, isLoading })
}

export function setIsLoadingTrue() {
  store.dispatch({ type: SET_IS_LOADING, isLoading: true })
}

export function getAllGames() {
  const filterBy = store.getState().gameModule.filterBy
  const allGamesFilter = { ...filterBy, pageIdx: null }
  store.dispatch({ type: SET_IS_LOADING, isLoading: true })
  return gameService
    .query(allGamesFilter)
    .then((games) => {
      store.dispatch({ type: SET_GAMES, games })
    })
    .catch((err) => {
      console.log('game action -> Cannot load games', err)
      throw err
    })
    .finally(() => {
      store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    })
}
