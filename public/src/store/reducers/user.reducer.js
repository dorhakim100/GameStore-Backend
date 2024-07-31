import { userService } from '../../services/user.service.js'

//* Count
export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'
export const CHANGE_BY = 'CHANGE_BY'

//* User
export const SET_USER = 'SET_USER'
export const SET_USER_SCORE = 'SET_USER_SCORE'

//* Shopping cart
export const TOGGLE_CART_IS_SHOWN = 'TOGGLE_CART_IS_SHOWN'
export const ADD_GAME_TO_CART = 'ADD_GAME_TO_CART'
export const REMOVE_GAME_FROM_CART = 'REMOVE_GAME_FROM_CART'
export const CLEAR_CART = 'CLEAR_CART'

const user = userService.getLoggedinUser()

const initialState = {
  count: 105,
  loggedInUser: userService.getLoggedinUser(),
  shoppingCart: (user && userService.getLoggedinUser().gamesInCart) || [],
}

export function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    //* Count
    case INCREMENT:
      return { ...state, count: state.count + 1 }
    case DECREMENT:
      return { ...state, count: state.count - 1 }
    case CHANGE_BY:
      return { ...state, count: state.count + action.diff }

    //* User
    case SET_USER:
      return {
        ...state,
        loggedInUser: action.user,
      }
    case SET_USER_SCORE:
      const loggedInUser = { ...state.loggedInUser, score: action.score }
      return { ...state, loggedInUser }
    //* Shopping Cart
    case TOGGLE_CART_IS_SHOWN:
      return { ...state, isCartShown: !state.isCartShown }

    case ADD_GAME_TO_CART:
      state.shoppingCart.map((game) => {
        if (game._id === action.game) {
          if (game.quantity === 0) {
            game.quantity = 1
          } else {
            game.quantity++
          }
          return {
            ...state,
            shoppingCart: [...state.shoppingCart],
          }
        }
      })
      return {
        ...state,
        shoppingCart: [...state.shoppingCart, action.game],
      }

    case REMOVE_GAME_FROM_CART:
      console.log(action.updatedUser)
      return { ...state, shoppingCart: action.updatedUser.gamesInCart }

    case CLEAR_CART:
      return { ...state, shoppingCart: [] }
    default:
      return state
  }
}
