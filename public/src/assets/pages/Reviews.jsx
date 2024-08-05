import { useEffect, useState } from 'react'

import { userService } from '../../services/user.service.js'
import { saveGame } from '../../store/actions/game.actions.js'
import { showSuccessMsg } from '../../services/event-bus.service.js'

import { Button } from '@mui/material'

export function Reviews({ game, removeReview, reviews, setReviews }) {
  // const { reviews } = book
  // const [reviews, setReviews] = useState(book.reviews)
  const [user, setUser] = useState(userService.getLoggedinUser() || {})
  console.log(reviews)
  useEffect(() => {
    console.log(game.reviews)
    // setReviews(game.reviews)
  }, [])

  // const reviews = game.reviews || [
  //   {
  //     fullName: 'Name',
  //     date: 'now',
  //     rating: 4,
  //     txt: 'bla bla',
  //   },
  //   {
  //     fullName: 'Name',
  //     date: 'now',
  //     rating: 4,
  //     txt: 'bla bla',
  //   },
  //   {
  //     fullName: 'Name',
  //     date: 'now',
  //     rating: 4,
  //     txt: 'bla bla',
  //   },
  // ]

  function removeReview(reviewIdx) {
    // console.log(reviews)
    game.reviews.splice(reviewIdx, 1)
    saveGame(game).then(() => {
      // swal.fire({
      //   // title: 'success',
      //   text: 'Review removed successfully',
      //   icon: 'success',
      // })
      showSuccessMsg('Review deleted')
      setReviews([...game.reviews])
    })
  }

  function onRemoveReview(id) {
    // console.log(id)

    const reviewIdx = reviews.findIndex((review) => review.id === id)
    console.log(reviewIdx)
    removeReview(reviewIdx)
  }
  return (
    <section>
      <h3>Reviews</h3>

      {reviews.length === 0 && <p>Couldn't find reviews...</p>}
      <div className='reviews-container'>
        {reviews.map((review) => {
          return (
            <div className='review' key={review.id}>
              {user.isAdmin && (
                <button
                  className='btn remove'
                  onClick={() => onRemoveReview(review.id, reviews)}
                >
                  Remove
                </button>
              )}
              <h4>{review.fullName}</h4>
              <h5>{review.date}</h5>
              <Stars rate={review.rating} />
              <p>{review.txt}</p>
            </div>
          )
        })}
      </div>
    </section>
  )

  function Stars({ rate }) {
    switch (rate) {
      case 1:
        return (
          <div>
            <i className='fa-solid fa-star star'></i>
          </div>
        )
      case 2:
        return (
          <div>
            <i className='fa-solid fa-star star'></i>
            <i className='fa-solid fa-star star'></i>
          </div>
        )
      case 3:
        return (
          <div>
            <i className='fa-solid fa-star star'></i>
            <i className='fa-solid fa-star star'></i>
            <i className='fa-solid fa-star star'></i>
          </div>
        )
      case 4:
        return (
          <div>
            <i className='fa-solid fa-star star'></i>
            <i className='fa-solid fa-star star'></i>
            <i className='fa-solid fa-star star'></i>
            <i className='fa-solid fa-star star'></i>
          </div>
        )
      case 5:
        return (
          <div>
            <i className='fa-solid fa-star star'></i>
            <i className='fa-solid fa-star star'></i>
            <i className='fa-solid fa-star star'></i>
            <i className='fa-solid fa-star star'></i>
            <i className='fa-solid fa-star star'></i>
          </div>
        )
    }
  }
}
