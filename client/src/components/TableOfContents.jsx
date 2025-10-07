import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookAPI } from '../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const TableOfContents = ({ onClose, currentIndex = 1, bookId }) => {
  const [padLength, setPadLength] = useState()
  const [chapters, setChapters] = useState(null)
  const [closing, setClosing] = useState(false) // state để trigger animation out

  const listRef = useRef([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchChapters = async () => {
      const chapters = await bookAPI.getChapters(bookId)
      setChapters(chapters)
      setPadLength(Math.ceil(Math.log10(chapters.length + 1)))
    }
    fetchChapters()
  }, [bookId])

  useEffect(() => {
    if (listRef.current[currentIndex - 1]) {
      listRef.current[currentIndex - 1].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [currentIndex, chapters])

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      onClose()
      setClosing(false)
    }, 300)
  }

  return (
    <>
      <button
        type='button'
        className={`btn btn-sm btn-danger position-fixed top-0 end-0 m-3 animate__animated animate__faster ${
          closing ? 'animate__slideOutRight' : 'animate__slideInRight'
        }`}
        style={{ zIndex: 9999 }}
        onClick={handleClose}>
        <FontAwesomeIcon icon={faXmark} />
      </button>

      <div
        className={`position-fixed top-0 end-0 vh-100 p-1`}
        style={{ zIndex: 2001 }}>
        <div
          className={`border shadow-sm p-1 position-relative h-100 overflow-auto bg-light rounded animate__animated animate__faster ${
            closing ? 'animate__slideOutRight' : 'animate__slideInRight'
          }`}
          style={{
            maxWidth: 'min(50vw, 400px)',
            minWidth: '100px',
            zIndex: 9999,
          }}>
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
        <div
          className={`cus-overlay animate__animated animate__faster ${
            closing ? 'animate__fadeOut' : 'animate__fadeIn'
          }`}
          onClick={handleClose}></div>
      </div>
    </>
  )
}

export default TableOfContents
