import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState, useEffect } from 'react'
import { CommentItem } from './CommentItem'
import {
  getReviewsByBook,
  createReview,
  updateReview,
  deleteReview,
} from '../services/api'
import { useSelector } from 'react-redux'
import { useSnackbar } from '../context/SnackbarContext'

const StarSelector = ({ rating, setRating, totalStars = 5, fixed = false }) => {
  return (
    <div className='mb-2'>
      {Array.from({ length: totalStars }).map((_, i) => {
        const starValue = i + 1
        const currentStar = rating
        return (
          <FontAwesomeIcon
            key={i}
            icon={faStarSolid}
            style={{
              color: starValue <= currentStar ? '#ffc107' : '#838383ff',
              cursor: 'pointer',
              marginRight: 2,
            }}
            onMouseEnter={() => !fixed && setRating(starValue)}
            onClick={() => !fixed && setRating(starValue)}
          />
        )
      })}
    </div>
  )
}

// Component ReviewForm
export function ReviewForm({ bookId }) {
  const [newReview, setNewReview] = useState('')
  const [rating, setRating] = useState(5)
  const [editing, setEditing] = useState(false)
  const [review, setReview] = useState(null)

  const textareaRef = useRef(null)
  const { showSnackbar } = useSnackbar()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus()
      const length = textareaRef.current.value.length
      textareaRef.current.setSelectionRange(length, length)
    }
  }, [editing])

  useEffect(() => {
    const fetchReview = async () => {
      const review = await getReviewsByBook(bookId)
      const r = review.find((c) => c.user_id === user.id) || null
      setReview(r)
      if (r) {
        setRating(r.rating)
        setNewReview(r.content)
      } else {
        setRating(5)
        setNewReview('')
      }
    }
    fetchReview()
  }, [bookId, user.id])

  const handleAddReview = async ({ content = '', rating }) => {
    if (!content.trim()) return
    if (!user.isLoggedIn) {
      showSnackbar({ message: 'Chưa đăng nhập', status: 'warning' })
      return
    }
    const res = await createReview(user.token, bookId, content, rating)
    res.User = { ...user, avatar_url: user.avatarUrl }
    return res
  }

  const handleSaveReview = async ({ content, rating, reviewId }) => {
    if (!content.trim()) return
    if (!user.isLoggedIn) {
      showSnackbar({ message: 'Chưa đăng nhập', status: 'warning' })
      return
    }
    const res = await updateReview(user.token, reviewId, content, rating)
    res.User = { ...user, avatar_url: user.avatarUrl }
    return res
  }

  const handleDeletePreview = async (id) => {
    if (!id) return
    const res = await deleteReview(user.token, id)
    showSnackbar(res)
  }

  return (
    <div className='mb-4'>
      {review && !editing ? (
        // Hiển thị bình luận hiện có
        <div className='mb-4 border p-1 p-md-3 rounded-3'>
          <StarSelector
            rating={review.rating}
            setRating={setRating}
            fixed={!editing}
          />
          <CommentItem comment={review} />
          <div className='pt-2 ps-5'>
            <button
              className='btn btn-sm btn-outline-primary me-2'
              onClick={() => {
                setEditing(true)
                setNewReview(review.content)
              }}>
              Sửa
            </button>
            <button
              className='btn btn-sm btn-outline-danger'
              onClick={() => {
                handleDeletePreview(review.id)
                setReview(null)
                setNewReview('')
              }}>
              Xoá
            </button>
          </div>
        </div>
      ) : (
        // Hiển thị form nhập hoặc chỉnh sửa
        <div className='mb-4'>
          <StarSelector rating={rating} setRating={setRating} />
          <textarea
            className='form-control mb-2'
            rows={3}
            ref={textareaRef}
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder='Viết đánh giá của bạn...'
          />
          {editing ? (
            <>
              <button
                className={`btn btn-outline-success me-2 ${
                  newReview === review?.content && rating === review?.rating
                    ? 'disabled'
                    : ''
                }`}
                onClick={async () => {
                  const res = await handleSaveReview({
                    content: newReview,
                    rating,
                    reviewId: review.id,
                  })
                  res && setReview(res)
                  setEditing(false)
                }}>
                Lưu
              </button>
              <button
                className={`btn btn-outline-warning`}
                onClick={() => {
                  setNewReview(review?.content || '')
                  setEditing(false)
                }}>
                Huỷ
              </button>
            </>
          ) : (
            <button
              className={`btn btn-primary ${
                newReview === '' ? 'disabled' : ''
              }`}
              onClick={async () => {
                const res = await handleAddReview({
                  content: newReview,
                  rating,
                })
                res && setReview(res)
              }}>
              Gửi
            </button>
          )}
        </div>
      )}
    </div>
  )
}
