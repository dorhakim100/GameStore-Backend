import { utilService } from '../../services/util.service.js'
import { userService } from '../../services/user.service.js'
import { useEffect, useState } from 'react'

import { showSuccessMsg } from '../../services/event-bus.service.js'
import { showErrorMsg } from '../../services/event-bus.service.js'
import { saveGame } from '../../store/actions/game.actions.js'

import Swal from 'sweetalert2'

export function AddReview({ game, setReviews }) {
  // const [reviews, setTheReviews] = useState(book.reviews)
  const [user, setUser] = useState(userService.getLoggedinUser() || {})
  // const reviews = book.reviews
  console.log(game)
  function onStarClick({ target }) {
    const rating = +target.value
    console.log(rating)
    setReview({
      fullName: fullName,
      rating: rating,
      date: date,
      txt: txt,
    })
  }

  // const inputRef = useRef()

  const [review, setReview] = useState({
    fullName: user.fullname || `Player`,
    rating: 0,
    date: new Date().toISOString().slice(0, 10),
    txt: '',
  })

  useEffect(() => {}, [])

  function onAddReview() {
    if (Object.keys(user).length === 0) {
      showErrorMsg('Please login to add review')
      return
    }
    // book.reviews.unshift(review)
    // book.reviews[0].id = utilService.makeId()
    // console.log(review)
    saveReview(review)
    setReview({
      fullName: `Player`,
      rating: 0,
      date: new Date().toISOString().slice(0, 10),
      txt: '',
    })
  }

  function handleChange({ target }) {
    const { value, name: field } = target
    setReview((prevReview) => ({ ...prevReview, [field]: value }))
  }

  const { fullName, date, txt } = review
  console.log(fullName)
  function saveReview(review) {
    if (!game.reviews) game.reviews = []
    review.id = utilService.makeId()
    game.reviews.unshift(review)
    console.log(game)
    console.log(review)

    saveGame(game)
      .then(() => {
        console.log('works')
        // showSuccessMsg('Review saved')
        Swal.fire({
          text: 'Review saved successfully',
          icon: 'success',
        })

        setReviews([...game.reviews])
      })
      .catch((err) => {
        showErrorMsg('Cannot save review')
        console.log('err:', err)
      })

    // booksService.save(book).then(() => {
    //   setReviews(...book.reviews)
    // })
  }

  return (
    <div className='new-review-container'>
      <h3>Add Review</h3>
      <div className='name-container'>
        <label htmlFor='review-name'>Name:</label>
        <input
          type='text'
          id='review-name'
          name='fullName'
          value={fullName}
          onChange={handleChange}
        />
      </div>
      <label htmlFor='date'>Date:</label>
      <input
        type='date'
        id='date'
        name='date'
        value={date}
        onChange={handleChange}
      />
      <textarea
        className='review-conten'
        name='txt'
        cols='30'
        rows='10'
        value={txt}
        onChange={handleChange}
      ></textarea>

      <div className='stars-container'>
        <div className='rate'>
          <input
            type='radio'
            id='star5'
            name='rate'
            value='5'
            onClick={onStarClick}
          />
          <label htmlFor='star5' title='text'>
            5 stars
          </label>
          <input
            type='radio'
            id='star4'
            name='rate'
            value='4'
            onClick={onStarClick}
          />
          <label htmlFor='star4' title='text'>
            4 stars
          </label>
          <input
            type='radio'
            id='star3'
            name='rate'
            value='3'
            onClick={onStarClick}
          />
          <label htmlFor='star3' title='text'>
            3 stars
          </label>
          <input
            type='radio'
            id='star2'
            name='rate'
            value='2'
            onClick={onStarClick}
          />
          <label htmlFor='star2' title='text'>
            2 stars
          </label>
          <input
            type='radio'
            id='star1'
            name='rate'
            value='1'
            onClick={onStarClick}
          />
          <label htmlFor='star1' title='text'>
            1 star
          </label>
        </div>
        <button className='btn' onClick={onAddReview}>
          Submit
        </button>
      </div>
    </div>
  )
}
