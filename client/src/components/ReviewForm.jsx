import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState, useEffect } from 'react'
import { CommentItem } from './CommentItem'

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
export function ReviewForm({
  myReview = {}, // object hoặc null
  handleAddReview = async () => {},
  handleSaveReview = async () => {},
  handleDeletePreview,
  isEditing = false,
}) {
  const [newReview, setNewReview] = useState(myReview.content || '')
  const [rating, setRating] = useState(myReview.rating || 5)
  const [editing, setEditing] = useState(isEditing)
  const [review, setReview] = useState(myReview)

  const textareaRef = useRef(null)

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus()
      const length = textareaRef.current.value.length
      textareaRef.current.setSelectionRange(length, length)
    }
  }, [editing])

  return (
    <div className='mb-4'>
      {review && !editing ? (
        // Hiển thị bình luận hiện có
        <div className='mb-4 border p-3 shadow rounded-3'>
          <div className='mb-2'>
            <strong>Bạn đã đánh giá:</strong>
          </div>
          <StarSelector
            rating={review.rating}
            setRating={setRating}
            fixed={!editing}
          />
          <CommentItem comment={review} />
          <div>
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
