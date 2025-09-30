import { useEffect, useRef } from 'react'
import { Button, ListGroup } from 'react-bootstrap'

const TableOfContents = ({ items, onClose, currentIndex = 1 }) => {
  const padLength = Math.ceil(Math.log10(items.length + 1))
  const listRef = useRef([])

  useEffect(() => {
    // scroll vào mục hiện tại khi component mount
    if (listRef.current[currentIndex - 1]) {
      listRef.current[currentIndex - 1].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [currentIndex])

  return (
    <div
      className='position-fixed top-0 end-0 vh-100 p-1'
      style={{ zIndex: 999 }}>
      <div
        className='border shadow-sm p-1 position-relative h-100 overflow-auto bg-light rounded'
        style={{ maxWidth: 'min(50vw, 400px)', zIndex: 9999 }}>
        <button
          type='button'
          className='btn btn-sm btn-danger position-absolute top-0 end-0 m-1'
          onClick={onClose}>
          &times;
        </button>
        <h5 className='mb-3'>Mục lục</h5>
        <ul className='list-group list-group-flush'>
          {items.map((item, index) => (
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
              onClick={() => console.log(index)}>
              {String(index + 1).padStart(padLength, '0')}. {item}
            </li>
          ))}
        </ul>
      </div>
      <div className='cus-overlay' onClick={onClose}></div>
    </div>
  )
}

export default TableOfContents
