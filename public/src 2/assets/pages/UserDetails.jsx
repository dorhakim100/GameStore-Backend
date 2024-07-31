import { useDispatch, useSelector } from 'react-redux'

import { Link, useParams, useNavigate } from 'react-router-dom'

import { useEffect, useState } from 'react'

import { gameService } from '../../services/game.service.js'
import { removeGame } from '../../store/actions/game.actions.js'
import { userService } from '../../services/user.service.js'

export function UserDetails() {
  const [user, setUser] = useState(userService.getLoggedinUser())
  const [orders, setOrders] = useState(user.orders || [])

  useEffect(() => {
    console.log(user)
    console.log(orders)
  }, [])

  function getOrderDate(placedAt) {
    const date = new Date(user.orders[0].placedAt).toLocaleDateString()
    return date
  }

  return (
    <section>
      <h2>Hello {user && user.fullname}</h2>
      <h3>Orders</h3>
      {(orders.length === 0 && (
        <Link to={`/game/`}>Place an order first</Link>
      )) ||
        (orders.length > 0 && (
          <table>
            <tr>
              <td>Order ID</td>
              <td>Placed At</td>
              <td>Amount</td>
              <td>Status</td>
              <td>Items</td>
            </tr>

            {orders.map((order) => {
              return (
                <tr className='order-container' key={order}>
                  <td>{order._id || '1111'}</td>
                  <td>{getOrderDate(order.placedAt)}</td>
                  <td>{order.amount}$</td>
                  <td>{order.statue || 'Placed'}</td>
                  <td className='items-container'>
                    {order.items.map((item) => {
                      return (
                        <Link
                          to={`/game/${item._id}`}
                          className='item-container'
                          key={item}
                        >
                          <span>{item.name}</span>
                          <img src={item.cover} alt='' />
                        </Link>
                      )
                    })}
                  </td>
                </tr>
              )
            })}
          </table>
        ))}
    </section>
  )
}
