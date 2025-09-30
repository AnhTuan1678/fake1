import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  getChapterContent,
  getStoryDetails,
  saveProgress,
  updateSettings,
  getProfile,
  getChapters,
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
} from '@fortawesome/free-solid-svg-icons'
import TableOfContents from '../components/TableOfContents'

const Reader = () => {
  const defaultSetting = {
    fontSize: '20px',
    fontFamily: 'Arial',
    lineHeight: 1.5,
    zoom: 1,
  }

  const { chapterIndex, id } = useParams(1)
  const navigate = useNavigate()

  const [content, setContent] = useState('')
  const [storyDetails, setStoryDetails] = useState({})
  const [showSettings, setShowSettings] = useState(false)
  const [setting, setSetting] = useState(defaultSetting)
  const [chapters, setChapters] = useState(null)
  const [showTOC, setShowTOC] = useState(false)

  // Lấy nội dung chương
  useEffect(() => {
    const fetchContent = async () => {
      const data = await getChapterContent(chapterIndex, id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setContent(data)
    }

    // Lưu tiến trình đọc khi load chương
    const token = localStorage.getItem('token')
    if (token) {
      try {
        saveProgress(token, id, chapterIndex, 0)
      } catch (err) {
        console.error('Lỗi khi lưu tiến trình:', err)
      }
    }

    fetchContent()
  }, [chapterIndex, id])

  // Lấy thông tin sách
  useEffect(() => {
    const fetchStoryDetails = async () => {
      const data = await getStoryDetails(id)
      setStoryDetails(data)
    }

    fetchStoryDetails()
  }, [id])

  // lấy danh sách chương
  useEffect(() => {
    const fetchChapters = async () => {
      const chapterData = await getChapters(id)
      setChapters(chapterData)
    }

    fetchChapters()
  }, [id])

  // Lấy setting
  useEffect(() => {
    const fetchUserSettings = async () => {
      const token = localStorage.getItem('token')
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
  }, [])

  // Lưu setting
  const handleSaveButton = async () => {
    localStorage.setItem('readerSettings', JSON.stringify(setting))
    setShowSettings(false)

    // Lưu lên server
    const token = localStorage.getItem('token')
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
    const token = localStorage.getItem('token')
    if (token) {
      try {
        await updateSettings(token, setting)
        console.log('Đã lưu setting lên server')
      } catch (err) {
        console.error('Lỗi khi lưu setting:', err)
      }
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
          // onClick={() => navigate(`/story/${storyDetails.id}`)}>
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
      <div className='container mx-auto p-4 flex-grow-1'>
        {showTOC && (
          <TableOfContents
            items={chapters.map((chapter) => chapter.title)}
            onClose={() => setShowTOC(false)}
            currentIndex={chapterIndex}
          />
        )}

        {storyDetails && (
          <div className='text-center'>
            <button
              className='mb-4 cursor-pointer bg-transparent border-0'
              onClick={() => navigate(`/story/${storyDetails.id}`)}>
              <h1 className='text-center'>{storyDetails.title}</h1>
            </button>
          </div>
        )}
        {content && (
          <>
            <h3 className='text-center'>
              Chương {content.index}: {content.title}
            </h3>
            <div
              className={
                'justify-content-between mt-4 chapter-nav d-flex border rounded bg-light p-2'
              }>
              {ChapterNavigation()}
            </div>
            <div className='d-flex justify-content-between border-bottom pb-2 border-dark fst-italic'>
              <span>Ngày phát hành: {content.created_at}</span>
              <span>{content.word_count} từ</span>
            </div>

            <div>
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
            'justify-content-between mt-4 chapter-nav d-flex border rounded bg-light p-2'
          }>
          {ChapterNavigation()}
        </div>
      </div>
      <div className='position-fixed bottom-0 end-0 p-4 d-flex flex-column gap-2'>
        {ChapterNavigation('d-md-block d-none')}
        <button
          className='btn btn-primary'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      </div>
    </>
  )
}

export default Reader
