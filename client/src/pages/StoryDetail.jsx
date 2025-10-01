import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  getStoryDetails,
  getChapters,
  getProgressByBook,
  addToBookshelf,
  getReviewsByBook,
  createReview,
  updateReview,
  deleteReview,
} from '../services/api'
import styles from './StoryDetail.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHeart,
  faBookmark,
  faEye,
  faFlag,
} from '@fortawesome/free-solid-svg-icons'
import Snackbar from '../components/SnackBar'
import { CommentItem } from '../components/CommentItem'
import { StarRating } from '../components/StartRating'
import { ReviewForm } from '../components/ReviewForm'
import { formatterStoryDetail } from '../utils/formatter'
import { useSelector } from 'react-redux'

const StoryDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [storyDetails, setStoryDetails] = useState(null)
  const [chapters, setChapters] = useState(null)
  const [progress, setProgress] = useState(null)
  const [snack, setSnack] = useState(null)
  const [showAllChapters, setShowAllChapters] = useState(false)
  const [avgRating, setAvgRating] = useState(0)

  const visibleChaptersDefault = 30

  const currentUser = useSelector((state) => state.user)

  const [reviews, setReview] = useState([])

  const [myReview, setMyReview] = useState(null)

  // lấy thông tin sách
  useEffect(() => {
    const fetchData = async () => {
      const data = await getStoryDetails(id)
      setStoryDetails(data)
      setAvgRating(
        data.reviewCount > 0
          ? (data.totalRating / data.reviewCount).toFixed(1)
          : 0,
      )
    }

    fetchData()
  }, [id])

  // lấy danh sách chương
  useEffect(() => {
    const fetchChapters = async () => {
      const chapterData = await getChapters(id)
      setChapters(chapterData)
      setShowAllChapters(chapterData.length <= visibleChaptersDefault)
    }

    fetchChapters()
  }, [id])

  // lấy tiến trình đọc
  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const data = await getProgressByBook(token, id)
          setProgress(data)
        } catch (err) {
          console.warn('Chưa có tiến trình đọc hoặc lỗi:', err)
        }
      }
    }
    fetchProgress()
  }, [id])

  // Lấy review
  useEffect(() => {
    const fetchReview = async () => {
      const review = await getReviewsByBook(id)
      const r = review.find((c) => c.user_id === currentUser.id) || null
      setMyReview(r)
      setReview(review.filter((r) => r.user_id !== currentUser.id))
    }
    fetchReview()
  }, [currentUser.id, id])

  const handleFollowButton = async () => {
    const token = localStorage.getItem('token')
    const res = await addToBookshelf(token, id)
    setSnack(res)
    setStoryDetails(formatterStoryDetail(res.book))
  }

  const handleAddReview = async ({ content = '', rating }) => {
    if (!content.trim()) return
    const token = localStorage.getItem('token')
    if (!token) {
      setSnack({ message: 'Chưa đăng nhập', status: 'warning' })
      return
    }
    const res = await createReview(token, id, content, rating)
    res.User = { ...currentUser, avatar_url: currentUser.avatarUrl }
    return res
  }

  const handleSaveReview = async ({ content, rating, reviewId }) => {
    if (!content.trim()) return
    const token = localStorage.getItem('token')
    if (!token) {
      setSnack({ message: 'Chưa đăng nhập', status: 'warning' })
      return
    }
    const res = await updateReview(token, reviewId, content, rating)
    res.User = { ...currentUser, avatar_url: currentUser.avatarUrl }
    return res
  }

  const handleDeletePreview = async (id) => {
    if (!id) return
    const token = localStorage.getItem('token')
    const res = await deleteReview(token, id)
    setSnack(res)
  }

  const InfoItem = ({ label, value }) => {
    return (
      <div>
        <label className='me-2 fw-bold'>{label}:</label>
        <span>{value}</span>
      </div>
    )
  }

  const ChapterItem = ({ chapter }) => {
    let classNames = `p-1 rounded ${styles.chapterItem} `

    if (progress) {
      if (chapter.index < progress.last_chapter_index) {
        classNames += styles.readChapter // đã đọc → mờ
      } else if (chapter.index === progress.last_chapter_index) {
        classNames += styles.currentChapter // đang đọc → highlight
      }
    }

    return (
      <div
        className={classNames}
        onClick={() =>
          navigate(`/story/${storyDetails.id}/chapter/${chapter.index}`)
        }>
        Chương {chapter.index}: {chapter.title}
      </div>
    )
  }

  return (
    <div className='container mx-auto p-4 flex-grow-1'>
      {snack && (
        <Snackbar
          status={snack.status}
          message={snack.message}
          onClose={() => setSnack(null)}
        />
      )}
      {storyDetails && (
        <div className='d-flex flex-column p-1 p-md-4 border rounded'>
          <div className='d-flex flex-column flex-md-row mb-4 align-items-center'>
            <img
              className={styles['story-image']}
              src={storyDetails.urlAvatar}
              alt={storyDetails.title}
            />
            <div className='m-4 d-flex flex-column flex-grow-1'>
              <p className='fs-3 fw-bold'>{storyDetails.title}</p>
              <div className='d-flex flex-row mb-2 flex-wrap'>
                {storyDetails.genres.map((genre, index) => (
                  <div
                    key={index}
                    className={`badge me-1 mb-1 p-2 ${styles['genre-badge']} `}
                    title={genre}>
                    {genre}
                  </div>
                ))}
              </div>
              {avgRating && (
                <InfoItem
                  label='Đánh giá'
                  value={<StarRating rating={parseFloat(avgRating)} />}
                />
              )}
              <div>
                <InfoItem label='Tác giả' value={storyDetails.author} />
              </div>
              <InfoItem label='Trạng thái' value={storyDetails.status} />
              <InfoItem label='Ngày đăng' value={storyDetails.publishedDate} />
              <div className='d-flex flex-column gap-3'>
                <div className='d-flex flex-row justify-content-between flex-wrap'>
                  <div className={`btn ${styles['cus-btn']}`}>
                    <FontAwesomeIcon icon={faHeart} /> {storyDetails.like}
                  </div>
                  <div
                    className={`btn ${styles['cus-btn']}`}
                    onClick={handleFollowButton}>
                    <FontAwesomeIcon icon={faBookmark} />{' '}
                    {storyDetails.followers}
                  </div>
                  <div className={`btn ${styles['cus-btn']}`}>
                    <FontAwesomeIcon icon={faEye} /> {storyDetails.views}
                  </div>
                  <div className={`btn ${styles['cus-btn']}`}>
                    <FontAwesomeIcon icon={faFlag} />
                  </div>
                </div>

                <div className='d-flex flex-row gap-2 flex-wrap'>
                  <div
                    className='btn btn-warning'
                    onClick={() =>
                      navigate(`/story/${storyDetails.id}/chapter/1`)
                    }>
                    Đọc từ đầu
                  </div>
                  {progress && progress.last_chapter_index && (
                    <div
                      className='btn btn-success'
                      onClick={() =>
                        navigate(
                          `/story/${storyDetails.id}/chapter/${progress.last_chapter_index}`,
                        )
                      }>
                      Tiếp tục
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='border-top border-3 pt-3 border-secondary'>
            <p className='fw-bold'>Tóm tắt:</p>
            {storyDetails.description
              ?.split('\n')
              .filter((line) => line.trim() !== '')
              .map((line, i) => (
                <p key={i} className='fw-lighter fst-italic'>
                  {line}
                </p>
              ))}
          </div>
        </div>
      )}
      {chapters && (
        <div className='d-flex flex-column mb-4 p-4 border rounded'>
          <h3>Chapters</h3>
          <div className='row row-cols-1 row-cols-sm-2 row-cols-lg-3'>
            {chapters.map((chapter, index) => (
              <div
                className={`col ${
                  visibleChaptersDefault > index || showAllChapters
                    ? ''
                    : 'd-none'
                }`}
                key={chapter.chapterId}>
                <ChapterItem chapter={chapter} />
              </div>
            ))}
            {visibleChaptersDefault < chapters.length && !showAllChapters && (
              <div className='text-center mt-3 w-100'>
                <button
                  className='btn btn-light'
                  onClick={() => setShowAllChapters(true)}>
                  Xem thêm
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Đánh giá */}
      <div className='d-flex flex-column mb-4 p-4 border rounded'>
        <h3>Review</h3>
        {myReview && (
          <ReviewForm
            myReview={myReview}
            handleAddReview={handleAddReview}
            handleSaveReview={handleSaveReview}
            deleteReview={deleteReview}
            handleDeletePreview={handleDeletePreview}
            setSnack={setSnack}
          />
        )}

        <p className='fw-bold'>Đánh giá của người khác:</p>
        {reviews
          .filter((c) => c.userId !== currentUser.id)
          .map((review) => (
            <CommentItem key={review.id} comment={review} />
          ))}
      </div>
    </div>
  )
}

export default StoryDetail
