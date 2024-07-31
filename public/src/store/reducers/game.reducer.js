import { gameService } from '../../services/game.service.js'

//* games
export const SET_GAMES = 'SET_GAMES'
export const REMOVE_GAME = 'REMOVE_GAME'
export const ADD_GAME = 'ADD_GAME'
export const UPDATE_GAME = 'UPDATE_GAME'
export const GAME_UNDO = 'GAME_UNDO'

// //* Shopping cart
// export const TOGGLE_CART_IS_SHOWN = 'TOGGLE_CART_IS_SHOWN'
// export const ADD_GAME_TO_CART = 'ADD_GAME_TO_CART'
// export const REMOVE_GAME_FROM_CART = 'REMOVE_GAME_FROM_CART'
// export const CLEAR_CART = 'CLEAR_CART'

export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SET_IS_LOADING = 'SET_IS_LOADING'

const initialState = {
  games: [],
  // isCartShown: false,
  // shoppingCart: [],
  isLoading: true,
  filterBy: gameService.getDefaultFilter(),
  lastGames: [],
}

export function gameReducer(state = initialState, action = {}) {
  switch (action.type) {
    //* games
    case SET_GAMES:
      return { ...state, games: action.games }
    case REMOVE_GAME:
      const lastGames = [...state.games]
      return {
        ...state,
        games: state.games.filter((game) => game._id !== action.gameId),
        lastGames,
      }
    case ADD_GAME:
      return {
        ...state,
        games: [...state.games, action.game],
      }
    case UPDATE_GAME:
      return {
        ...state,
        games: state.games.map((game) =>
          game._id === action.game._id ? action.game : game
        ),
      }

    // //* Shopping Cart
    // case TOGGLE_CART_IS_SHOWN:
    //   return { ...state, isCartShown: !state.isCartShown }

    // case ADD_GAME_TO_CART:
    //   return {
    //     ...state,
    //     shoppingCart: [...state.shoppingCart, action.game],
    //   }

    // case REMOVE_GAME_FROM_CART:
    //   const shoppingCart = state.shoppingCart.filter(
    //     (game) => game._id !== action.gameId
    //   )
    //   return { ...state, shoppingCart }

    // case CLEAR_CART:
    //   return { ...state, shoppingCart: [] }

    case SET_FILTER_BY:
      return {
        ...state,
        filterBy: { ...state.filterBy, ...action.filterBy },
      }

    case SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      }
    // case CART_UNDO:
    //   return {
    //     ...state,
    //     games: [...state.lastGames],
    //   }

    default:
      return state
  }
}
