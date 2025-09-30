import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  getStoryDetails,
  getChapters,
  getProgressByBook,
  addToBookshelf,
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
import { formatterStoryDetail } from '../utils/formatter'

const StoryDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [storyDetails, setStoryDetails] = useState(null)
  const [chapters, setChapters] = useState(null)
  const [progress, setProgress] = useState(null)
  const [snack, setSnack] = useState(null)

  // lấy thông tin sách
  useEffect(() => {
    const fetchData = async () => {
      const data = await getStoryDetails(id)
      setStoryDetails(data)
    }

    fetchData()
  }, [id])

  // lấy danh sách chương
  useEffect(() => {
    const fetchChapters = async () => {
      const chapterData = await getChapters(id)
      setChapters(chapterData)
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

  const handleFollowButton = async () => {
    const token = localStorage.getItem('token')
    const res = await addToBookshelf(token, id)
    setSnack(res)
    setStoryDetails(formatterStoryDetail(res.book))
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
            {chapters.map((chapter) => (
              <div className='col' key={chapter.chapterId}>
                <ChapterItem chapter={chapter} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StoryDetail
