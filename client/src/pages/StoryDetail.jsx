import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { reviewAPI, bookAPI, progressAPI, bookshelfAPI } from '../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHeart,
  faBookmark,
  faEye,
  faClock,
  faShareAlt,
  faList,
  faDownload,
  faUser,
  faRss,
  faCalendar,
  faStar,
} from '@fortawesome/free-solid-svg-icons'
import { CommentItem } from '../components/CommentItem'
import { StarRating } from '../components/StartRating'
import { ReviewForm } from '../components/ReviewForm'
import { useSnackbar } from '../context/SnackbarContext'
import { timeAgo } from '../utils/timeAgo'
import { formatterStoryDetail } from '../utils/formatter'
import styles from './StoryDetail.module.css'

const StoryDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [storyDetails, setStoryDetails] = useState(null)
  const [chapters, setChapters] = useState(null)
  const [progress, setProgress] = useState(null)
  const [showAllChapters, setShowAllChapters] = useState(false)
  const [avgRating, setAvgRating] = useState(0)
  const [reviews, setReview] = useState([])

  const visibleChaptersDefault = 30

  const currentUser = useSelector((state) => state.user)
  const { showSnackbar } = useSnackbar()

  // lấy thông tin sách
  useEffect(() => {
    const fetchData = async () => {
      const data = await bookAPI.getStoryDetails(id)
      setStoryDetails(data)
      setAvgRating(
        data.reviewCount > 0
          ? (data.totalRating / data.reviewCount).toFixed(1)
          : null,
      )
    }

    fetchData()
  }, [id])

  // lấy danh sách chương
  useEffect(() => {
    const fetchChapters = async () => {
      const chapterData = await bookAPI.getChapters(id)
      setChapters(chapterData)
      setShowAllChapters(chapterData.length <= visibleChaptersDefault)
    }

    fetchChapters()
  }, [id])

  // lấy tiến trình đọc
  useEffect(() => {
    const fetchProgress = async () => {
      const token = currentUser.token
      if (token) {
        try {
          const data = await progressAPI.getProgressByBook(token, id)
          setProgress(data)
        } catch (err) {
          console.warn('Chưa có tiến trình đọc hoặc lỗi:', err)
        }
      }
    }
    fetchProgress()
  }, [currentUser.token, id])

  // Lấy review
  useEffect(() => {
    const fetchReview = async () => {
      const review = await reviewAPI.getReviewsByBook(id)
      setReview(review.filter((r) => r.user_id !== currentUser.id))
    }
    fetchReview()
  }, [currentUser.id, id])

  const handleFollowButton = async () => {
    const token = currentUser.token
    const res = await bookshelfAPI.addToBookshelf(token, id)
    const formatted = formatterStoryDetail(res.book)
    setStoryDetails((pre) => ({ ...formatted, genres: pre.genres }))
    setAvgRating(
      formatted.reviewCount > 0
        ? (formatted.totalRating / formatted.reviewCount).toFixed(1)
        : null,
    )
    showSnackbar(res)
    if (res.ok) setStoryDetails(formatterStoryDetail(res.book))
  }

  const handleShareClick = () => {
    const url = window.location.origin + window.location.pathname
    navigator.clipboard
      .writeText(url)
      .then(() => {
        showSnackbar({ message: 'Đường dẫn đã được copy: ' + url })
      })
      .catch((err) => {
        console.error('Copy thất bại:', err)
        showSnackbar({ status: 'error', message: 'Copy thất bại' })
      })
  }

  const InfoItem = ({ label, value, icon }) => {
    return (
      <div className='row'>
        <label className='m-0 fw-bold opacity-75 col col-6 col-md-4 col-lg-3'>
          <FontAwesomeIcon icon={icon} />
          {label}
        </label>
        <span className='m-0 opacity-75 col'>{value}</span>
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
    <div className='container mx-auto p-0 p-top-4 p-end-4 flex-grow-1'>
      {storyDetails && (
        <div className='d-flex flex-column p-3 p-md-4 mb-4 border rounded cus-container'>
          <div className='row'>
            <div className='col col-12 col-md-4 col-lg-3 d-flex align-items-center justify-content-center'>
              <div className='w-50 w-md-100'>
                <div
                  className='ratio ratio-2x3 bg-cover bg-center'
                  style={{
                    backgroundImage: `url(${storyDetails.urlAvatar})`,
                  }}></div>
              </div>
            </div>
            <div className='m-4 d-flex flex-column col'>
              <p className='fs-2'>{storyDetails.title}</p>
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
                  icon={faStar}
                />
              )}
              <div>
                <InfoItem
                  label='Tác giả'
                  value={storyDetails.author}
                  icon={faUser}
                />
              </div>
              <InfoItem
                label='Tình trạng'
                value={storyDetails.status}
                icon={faRss}
              />
              <InfoItem
                label='Ngày đăng'
                value={new Date(
                  storyDetails.publishedDate,
                ).toLocaleDateString()}
                icon={faCalendar}
              />
              <div className='d-flex flex-column gap-3'>
                <div className='d-flex flex-row justify-content-between flex-wrap p-3 col col-12 col-md-10 col-lg-8'>
                  <div className='btn opacity-hover-50 p-0'>
                    <FontAwesomeIcon icon={faHeart} /> {storyDetails.like}
                  </div>
                  <div
                    className='btn opacity-hover-50 p-0'
                    onClick={handleFollowButton}>
                    <FontAwesomeIcon icon={faBookmark} />{' '}
                    {storyDetails.followers}
                  </div>
                  <div className='btn opacity-hover-50 p-0'>
                    <FontAwesomeIcon icon={faEye} /> {storyDetails.views}
                  </div>
                  <div className='btn opacity-hover-50 p-0'>
                    <FontAwesomeIcon icon={faClock} />
                    {timeAgo(storyDetails.updatedAt)}
                  </div>
                  <div className='btn opacity-hover-50 p-0'>
                    <FontAwesomeIcon icon={faList} />
                    {storyDetails.chapterCount}
                  </div>
                  <div className='btn opacity-hover-50 p-0'>
                    <FontAwesomeIcon icon={faDownload} />
                  </div>
                  <div
                    className='btn opacity-hover-50 p-0'
                    onClick={handleShareClick}>
                    <FontAwesomeIcon icon={faShareAlt} />
                  </div>
                </div>

                <div className='d-flex flex-row gap-2 flex-wrap'>
                  <div
                    className='btn btn-warning text-white'
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
          <Description description={storyDetails.description} />
        </div>
      )}
      {chapters && (
        <div className='d-flex flex-column mb-4 p-4 border rounded cus-container'>
          <h3>Chapters</h3>
          <div className='position-relative'>
            <div className='row row-cols-1 row-cols-sm-2 row-cols-lg-3 mb-3'>
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
            </div>
            {visibleChaptersDefault < chapters.length && !showAllChapters && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '4rem',
                  background:
                    'linear-gradient(180deg, hsla(0,0%,100%,0) 0%, #fff 75%, #fff)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>
          {visibleChaptersDefault < chapters.length && !showAllChapters && (
            <div className='text-center w-100'>
              <div
                className='btn opacity-hover-50'
                onClick={() => setShowAllChapters(true)}>
                Xem thêm
              </div>
            </div>
          )}
        </div>
      )}
      {/* Đánh giá */}
      <div className='d-flex flex-column mb-4 p-4 border rounded cus-container'>
        <ReviewForm bookId={id} />

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

const Description = ({ description }) => {
  const [showAll, setShowAll] = useState(false)
  const [needsClamp, setNeedsClamp] = useState(false)

  const textRef = useRef(null)

  const maxLines = 6

  useEffect(() => {
    const el = textRef.current
    if (el) {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight)
      const lines = el.scrollHeight / lineHeight
      if (lines > maxLines) {
        setNeedsClamp(true)
      } else {
        setNeedsClamp(false)
      }
    }
  }, [description])

  const toggleShow = () => {
    if (showAll) {
      const rect = textRef.current.getBoundingClientRect()
      const offset = window.scrollY + rect.top

      setShowAll(false)

      // cuộn về vị trí cũ sau khi thu gọn
      setTimeout(() => {
        window.scrollTo({ top: offset, behavior: 'auto' })
      }, 50) // delay nhỏ để DOM reflow
    } else {
      setShowAll(true)
    }
  }

  return (
    <>
      <div className='position-relative border-top border-3 pt-3 border-secondary'>
        <p
          ref={textRef}
          className='fw-lighter fst-italic mb-1'
          style={{
            display: '-webkit-box',
            WebkitLineClamp: !showAll && needsClamp ? maxLines : 'unset',
            WebkitBoxOrient: 'vertical',
            overflow: !showAll && needsClamp ? 'hidden' : 'visible',
          }}>
          {description}
        </p>

        {!showAll && needsClamp && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4rem',
              background:
                'linear-gradient(180deg, hsla(0,0%,100%,0) 0%, #fff 75%, #fff)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
      {needsClamp && (
        <div className='btn opacity-hover-50 mt-1' onClick={toggleShow}>
          {showAll ? 'Thu gọn' : 'Xem thêm'}
        </div>
      )}
    </>
  )
}

export default StoryDetail
