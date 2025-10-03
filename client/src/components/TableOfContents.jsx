import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getChapters } from '../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const TableOfContents = ({ onClose, currentIndex = 1, bookId }) => {
  const [padLength, setPadLength] = useState()
  const [chapters, setChapters] = useState(null)

  const listRef = useRef([])

  const navigate = useNavigate()

  // lấy danh sách chương
  useEffect(() => {
    const fetchChapters = async () => {
      const chapters = await getChapters(bookId)
      setChapters(chapters)
      setPadLength(Math.ceil(Math.log10(chapters.length + 1)))
    }

    fetchChapters()
  }, [bookId])

  // scroll vào mục hiện tại khi component mount
  useEffect(() => {
    if (listRef.current[currentIndex - 1]) {
      listRef.current[currentIndex - 1].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [currentIndex, chapters])

  return (
    <div
      className='position-fixed top-0 end-0 vh-100 p-1'
      style={{ zIndex: 1001 }}>
      <div
        className='border shadow-sm p-1 position-relative h-100 overflow-auto bg-light rounded'
        style={{
          maxWidth: 'min(50vw, 400px)',
          minWidth: '100px',
          zIndex: 9999,
        }}>
        <button
          type='button'
          className='btn btn-sm btn-danger position-fixed top-0 end-0 m-3'
          style={{ zIndex: 9999 }}
          onClick={onClose}>
          {/* &times; */}
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h5 className='mb-3'>Mục lục</h5>
        {chapters ? (
          <ul className='list-group list-group-flush'>
            {chapters.map((chapter, index) => (
              <li
                key={index}
                ref={(el) => (listRef.current[index] = el)}
                className={`list-group-item cursor-pointer p-1 btn btn-light text-start text-nowrap text-truncate ${
                  index < currentIndex - 1 ? 'opacity-75' : ''
                }`}
                style={
                  index === currentIndex - 1
                    ? {
                        backgroundColor: '#ffeaa7',
                        fontWeight: 'bold',
                        border: '1px solid #fdcb6e',
                      }
                    : {}
                }
                onClick={() => {
                  navigate(`/story/${bookId}/chapter/${index + 1}`)
                }}>
                {String(index + 1).padStart(padLength, '0')}. {chapter.title}
              </li>
            ))}
          </ul>
        ) : (
          <div className='d-flex justify-content-center align-items-center'>
            <div className='spinner-border text-primary' role='status'></div>
          </div>
        )}
      </div>
      <div className='cus-overlay' onClick={onClose}></div>
    </div>
  )
}

export default TableOfContents
