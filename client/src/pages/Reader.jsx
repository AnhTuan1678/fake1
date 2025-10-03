import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  getChapterContent,
  getStoryDetails,
  saveProgress,
  updateSettings,
  getProfile,
  createComment,
  deleteComment,
  getCommentsByChapter,
} from '../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './Reader.module.css'
import {
  faHome,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faBars,
  faCog,
  faTimes,
  faSave,
  faRefresh,
  faComment,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import TableOfContents from '../components/TableOfContents'
import { CommentItem } from '../components/CommentItem'
import { CommentBox } from '../components/CommentBox'
import { useSelector } from 'react-redux'
import { buildCommentTree } from '../utils/buildCommentTree'
import { timeAgo } from '../utils/timeAgo'
import { useSnackbar } from '../context/SnackbarContext'

const Reader = () => {
  const defaultSetting = {
    fontSize: '18px',
    fontFamily: 'Times New Roman',
    lineHeight: 1.5,
    zoom: 1,
  }

  const { chapterIndex, id } = useParams(1)
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.user)
  const { showSnackbar } = useSnackbar()

  const [content, setContent] = useState('')
  const [storyDetails, setStoryDetails] = useState({})
  const [showSettings, setShowSettings] = useState(false)
  const [setting, setSetting] = useState(defaultSetting)
  const [showTOC, setShowTOC] = useState(false)
  const [comments, setComments] = useState([])
  const [replyTo, setReplyTo] = useState(null)

  const [showNav, setShowNav] = useState(true)
  const contentRef = useRef(null)

  // Lấy nội dung chương
  useEffect(() => {
    const fetchContent = async () => {
      const data = await getChapterContent(chapterIndex, id)
      const comments = await getCommentsByChapter(data.id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setContent(data)
      setComments(comments)
    }

    // Lưu tiến trình đọc khi load chương
    if (currentUser.token) {
      try {
        saveProgress(currentUser.token, id, chapterIndex, 0)
      } catch (err) {
        console.error('Lỗi khi lưu tiến trình:', err)
      }
    }

    fetchContent()
  }, [chapterIndex, id, currentUser.token])

  // Lấy thông tin sách
  useEffect(() => {
    const fetchStoryDetails = async () => {
      const data = await getStoryDetails(id)
      setStoryDetails(data)
    }

    fetchStoryDetails()
  }, [id])

  // Lấy setting
  useEffect(() => {
    const fetchUserSettings = async () => {
      const token = currentUser.token
      if (token) {
        const profile = await getProfile(token)
        if (profile.personal_settings) {
          const defaultSetting = {
            fontSize: '20px',
            fontFamily: 'Arial',
            lineHeight: 1.5,
            zoom: 1,
          }
          const merged = { ...defaultSetting, ...profile.personal_settings }

          setSetting(merged)
        }
      }
    }

    fetchUserSettings()
  }, [currentUser.token])

  // Đổi màu body
  useEffect(() => {
    const prevColor = document.body.style.backgroundColor
    document.body.style.backgroundColor = 'var(--color-chapter-background)'
    return () => {
      document.body.style.backgroundColor = prevColor
    }
  }, [])

  // Tính toán việc hiển thị thanh nav trên điện thoại
  // Nếu scroll gần hết content => ẩn
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return

      const rect = contentRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // rect.bottom là khoảng cách từ top viewport tới bottom content
      if (rect.bottom - windowHeight < 50) {
        // Gần cuối content → ẩn
        setShowNav(false)
      } else {
        // Ở giữa → hiện
        setShowNav(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // kiểm tra khi mount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lưu setting
  const handleSaveButton = async () => {
    localStorage.setItem('readerSettings', JSON.stringify(setting))
    setShowSettings(false)

    // Lưu lên server
    const token = currentUser.token
    if (token) {
      try {
        await updateSettings(token, setting)
        console.log('Đã lưu setting lên server')
      } catch (err) {
        console.error('Lỗi khi lưu setting:', err)
      }
    }
  }

  // Reset setting
  const handleResetButton = async () => {
    const defaultSetting = {
      fontSize: '20px',
      fontFamily: 'Arial',
      lineHeight: 1.5,
      zoom: 1,
    }
    setSetting(defaultSetting)

    // Lưu lên server
    const token = currentUser.token
    if (token) {
      try {
        await updateSettings(token, setting)
        console.log('Đã lưu setting lên server')
      } catch (err) {
        console.error('Lỗi khi lưu setting:', err)
      }
    }
  }

  const handleSendComment = async (message, parentId = null) => {
    if (!message || !message.trim()) return

    const token = currentUser.token
    const res = await createComment(token, content.id, message, parentId)
    res.User = { ...currentUser, avatar_url: currentUser.avatarUrl }

    setComments([res, ...comments]) // thêm vào đầu
    setReplyTo(null) // reset reply nếu có
  }

  const handleDeleteComment = async (token, commentId) => {
    try {
      const res = await deleteComment(token, commentId)
      showSnackbar(res)
      setComments((prevComments) =>
        prevComments.filter(
          (c) => c.id !== commentId && c.parent_id !== commentId,
        ),
      )
    } catch (error) {
      console.log(error)
      showSnackbar({ status: 'error', message: 'Xoá comment thất bại' })
    }
  }

  const ChapterNavigation = (className) => {
    return (
      <>
        {/* Nút Previous */}
        <button
          disabled={chapterIndex <= 1}
          className={`btn btn-primary ${className}`}
          onClick={() => {
            if (chapterIndex > 1) {
              navigate(
                `/story/${storyDetails.id}/chapter/${
                  parseInt(chapterIndex) - 1
                }`,
              )
            }
          }}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        {/* Nút Home */}
        <button
          className={`btn btn-primary ${className}`}
          onClick={() => navigate(`/story/${storyDetails.id}`)}>
          <FontAwesomeIcon icon={faHome} />
        </button>

        {/* Nút Chapter List */}
        <button
          className={`btn btn-primary ${className}`}
          onClick={() => setShowTOC(true)}>
          <FontAwesomeIcon icon={faBars} />
        </button>

        {/* Nút Settings */}
        <button
          className={`btn btn-primary ${className}`}
          onClick={() => setShowSettings(!showSettings)}>
          <FontAwesomeIcon icon={faCog} />
        </button>

        {/* Nút Next */}
        <button
          disabled={storyDetails.chapterCount <= chapterIndex}
          className={`btn btn-primary ${className}`}
          onClick={() => {
            if (storyDetails.chapterCount > chapterIndex) {
              navigate(
                `/story/${storyDetails.id}/chapter/${
                  parseInt(chapterIndex) + 1
                }`,
              )
            }
          }}>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>

        {showSettings && (
          // Overlay nền xám khi popup mở
          <div className='cus-overlay' onClick={() => setShowSettings(false)}>
            {/* Popup Settings */}
            <div
              className='position-fixed top-50 start-50 translate-middle bg-white p-4 rounded shadow'
              style={{ zIndex: 1000, minWidth: '350px' }}
              onClick={(e) => e.stopPropagation()}>
              {/* Nút close */}
              <button
                className='btn btn-light position-absolute top-0 end-0 m-2 p-1'
                onClick={() => setShowSettings(false)}
                style={{ borderRadius: '50%', width: '30px', height: '30px' }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h5>Settings</h5>

              {/* font size */}
              <div className='mb-2 d-flex'>
                <label className='text-center'>Font Size:</label>
                <div className='flex-grow-1'></div>
                <h6 className='text-center p-0 m-0'>{setting.fontSize}</h6>
                <input
                  type='range'
                  min='12'
                  max='36'
                  value={parseInt(setting.fontSize, 10)}
                  onChange={(e) =>
                    setSetting((prev) => ({
                      ...prev,
                      fontSize: `${e.target.value}px`,
                    }))
                  }
                />
              </div>

              {/* font family */}
              <div className='mb-2 d-flex align-items-center'>
                <label className='text-center'>Font:</label>
                <div className='flex-grow-1'></div>
                <select
                  className='form-select w-auto'
                  value={setting.fontFamily}
                  onChange={(e) =>
                    setSetting((prev) => ({
                      ...prev,
                      fontFamily: e.target.value,
                    }))
                  }>
                  <option value='Arial' style={{ fontFamily: 'Arial' }}>
                    Arial
                  </option>
                  <option
                    value='Times New Roman'
                    style={{ fontFamily: 'Times New Roman' }}>
                    Times New Roman
                  </option>
                  <option value='Verdana' style={{ fontFamily: 'Verdana' }}>
                    Verdana
                  </option>
                  <option value='Tahoma' style={{ fontFamily: 'Tahoma' }}>
                    Tahoma
                  </option>
                </select>
              </div>

              {/* line height */}
              <div className='mb-2 d-flex align-items-center'>
                <label className='text-center'>Line Height:</label>
                <div className='flex-grow-1'></div>
                <h6 className='text-center p-0 m-0'>{setting.lineHeight}</h6>
                <input
                  type='range'
                  min='1'
                  max='2'
                  step='0.1'
                  value={setting.lineHeight}
                  onChange={(e) =>
                    setSetting((prev) => ({
                      ...prev,
                      lineHeight: parseFloat(e.target.value),
                    }))
                  }
                />
              </div>

              {/* zoom */}
              <div className='mb-2 d-flex align-items-center'>
                <label className='text-center'>Zoom:</label>
                <div className='flex-grow-1'></div>
                <h6 className='text-center p-0 m-0'>{`${parseInt(
                  setting.zoom * 100,
                )}%`}</h6>
                <input
                  type='range'
                  min='50'
                  max='200'
                  value={parseInt(setting.zoom * 100)}
                  onChange={(e) =>
                    setSetting((prev) => ({
                      ...prev,
                      zoom: e.target.value / 100,
                    }))
                  }
                />
                %
              </div>

              <div className='mt-4 d-flex'>
                {/* Nút reset */}
                <button
                  className='btn btn-warning d-flex '
                  onClick={handleResetButton}>
                  <FontAwesomeIcon icon={faRefresh} />
                </button>
                <div className='flex-grow-1'></div>
                {/* Nút Save */}
                <button
                  className='btn btn-success d-flex '
                  onClick={handleSaveButton}>
                  <FontAwesomeIcon icon={faSave} />
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <div className='container mx-auto flex-grow-1'>
        {showTOC && (
          <TableOfContents
            bookId={id}
            onClose={() => setShowTOC(false)}
            currentIndex={chapterIndex}
          />
        )}

        {storyDetails && (
          <div className='text-center'>
            <h2
              className='mb-0 cursor-pointer opacity-hover-50 bg-transparent fs-5 fw-bold'
              onClick={() => navigate(`/story/${storyDetails.id}`)}>
              {storyDetails.title}
            </h2>
          </div>
        )}
        {content && (
          <>
            {showNav && (
              <div
                className={
                  'justify-content-between mt-4 chapter-nav d-flex rounded bg-transparent p-2 position-fixed start-0 bottom-0 end-0'
                }>
                {ChapterNavigation('d-md-none d-block')}
                <button
                  className='btn btn-primary d-md-none d-block'
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }>
                  <FontAwesomeIcon icon={faArrowUp} />
                </button>
              </div>
            )}

            <h5 className='text-center mb-0 fw-bold fs-6'>
              Chương {content.index}: {content.title}
            </h5>
            <h6 className='text-center fw-bold fs-7 mb-4'>
              Cập nhật: {timeAgo(content.created_at)} - Độ dài:{' '}
              {content.word_count} từ
            </h6>

            <div ref={contentRef}>
              {content.content.split('\n').map((line, index) => {
                const imgMatch = line.match(/^\[!img\]\((.+)\)$/)
                if (imgMatch) {
                  return (
                    <img
                      className={styles.img}
                      key={index}
                      src={imgMatch[1]}
                      alt={`image-${index}`}
                    />
                  )
                } else if (line.trim() !== '') {
                  return (
                    <p style={setting} key={index}>
                      {line}
                    </p>
                  )
                } else {
                  return null
                }
              })}
            </div>
          </>
        )}

        <div
          className={
            'justify-content-between mt-4 chapter-nav d-flex border rounded bg-transparent p-2 mb-5'
          }>
          {ChapterNavigation()}
        </div>

        {/* Bình luận */}
        <div className='d-flex flex-column mb-4 p-4 border rounded cus-container'>
          <h3>Bình luận</h3>
          <div className='pb-4'>
            <CommentBox
              defaultContent=''
              onCancel={null}
              onSend={(mess) => handleSendComment(mess)}
              focus={false}
            />
          </div>

          {buildCommentTree(comments).map((comment) => (
            <CommentNode
              key={comment.id}
              comment={comment}
              replyTo={replyTo}
              setReplyTo={setReplyTo}
              handleSendComment={handleSendComment}
              handleDeleteComment={handleDeleteComment}
            />
          ))}
        </div>
      </div>
      <div className='position-fixed bottom-0 end-0 p-4 d-md-flex d-none flex-column gap-2'>
        {ChapterNavigation()}
        <button
          className='btn btn-primary'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      </div>
    </>
  )
}

const CommentNode = ({
  comment,
  replyTo,
  setReplyTo,
  handleSendComment,
  handleDeleteComment,
}) => {
  const user = useSelector((state) => state.user)

  const handleReplyClick = () => setReplyTo(comment.id)

  return (
    <div className='p-0 mb-2'>
      <CommentItem comment={comment} />

      <div className='d-flex flex-row align-items-center ms-5'>
        <h6 className='me-3 ms-2'>{timeAgo(comment.created_at)}</h6>
        <div
          className='btn opacity-hover-50 m-0 p-0 d-flex flex-row me-3'
          onClick={handleReplyClick}>
          <FontAwesomeIcon icon={faComment} />
          <p className='p-0 m-0'>Trả lời</p>
        </div>
        {user.id === comment.user_id && (
          <div
            className='btn opacity-hover-50 m-0 p-0 d-flex flex-row text-danger'
            onClick={() => handleDeleteComment(user.token, comment.id)}>
            <FontAwesomeIcon icon={faTrash} />
            <p className='p-0 m-0'>Xoá</p>
          </div>
        )}
      </div>

      {replyTo === comment.id && (
        <CommentBox
          defaultContent={`@${comment.User?.username || ''} `}
          onCancel={() => setReplyTo(null)}
          onSend={(mess) =>
            handleSendComment(mess, comment.parent_id ?? comment.id)
          }
        />
      )}

      {comment.replies?.length > 0 && (
        <div className='ms-5'>
          {comment.replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              replyTo={replyTo}
              setReplyTo={setReplyTo}
              handleSendComment={handleSendComment}
              handleDeleteComment={handleDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Reader
