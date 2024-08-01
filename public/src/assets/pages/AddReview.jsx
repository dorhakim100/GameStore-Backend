import { utilService } from '../../services/util.service.js'
import { useEffect, useState } from 'react'

export function AddReview({ book, saveReview }) {
  // const [reviews, setTheReviews] = useState(book.reviews)

  // const reviews = book.reviews

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
    fullName: 'Books Reader',
    rating: 0,
    date: new Date().toISOString().slice(0, 10),
    txt: '',
  })

  // useEffect(() => {
  //   // console.log('inputRef:', inputRef)
  //   inputRef.current.focus()
  // }, [])

  function onAddReview() {
    // book.reviews.unshift(review)
    // book.reviews[0].id = utilService.makeId()
    // console.log(review)
    saveReview(review)
    setReview({
      fullName: 'Books Reader',
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
