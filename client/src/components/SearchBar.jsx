import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import styles from './SearchBar.module.css'
import { searchBooks } from '../services/api'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({ className = '' }) => {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  const [results, setResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1) // index đang focus
  const wrapperRef = useRef(null)

  const navigate = useNavigate()

  // Debounce query
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(handler)
  }, [query])

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      setShowDropdown(false)
      return
    }

    const fetchData = async () => {
      const data = await searchBooks(debouncedQuery)
      setResults(data)
      setShowDropdown(true)
      setHighlightedIndex(-1) // reset highlight khi search mới
    }

    fetchData()
  }, [debouncedQuery])

  // Click ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Chọn sách
  const handleSelect = (book) => {
    setQuery('')
    setShowDropdown(false)
    navigate(`/story/${book.id}`)
  }

  // Xử lý keyboard
  const handleKeyDown = (e) => {
    if (!showDropdown) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0 && highlightedIndex < results.length) {
        handleSelect(results[highlightedIndex])
      }
    }
  }

  return (
    <div
      className={`${className} align-items-center dropdown ${styles['search-bar']}`}
      style={
        showDropdown && results.length > 0
          ? {
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
            }
          : { borderRadius: '12px' }
      }
      ref={wrapperRef}>
      <form
        className={`d-flex align-items-center w-100 rounded-pill overflow-hidden rounded-t-3 p-1 pb-0`}
        onSubmit={(e) => e.preventDefault()}>
        <input
          type='text'
          className={`${styles['search-input']} flex-grow-1 border-0 ps-2`}
          placeholder='Nhập ít nhất 2 kí tự'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown} // <-- thêm
        />
        <button type='submit' className={`${styles['search-btn']} border-0`}>
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faSearch} />
          </div>
        </button>
      </form>

      <div
        className='position-absolute rounded-b-3 start-0 end-0 p-0 m-0 overflow-hidden'
        style={{
          backgroundColor: 'inherit',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
        }}>
        {showDropdown && results.length > 0 && (
          <ul className='show p-0 overflow-hidden m-0'>
            {results.map((book, index) => (
              <li
                key={book.id}
                className={`${styles['dropdown-item']} ${
                  index === highlightedIndex ? styles.highlighted : ''
                } d-flex align-items-center gap-2 p-1 cursor-pointer border-bottom`}
                onClick={() => handleSelect(book)}
                onMouseEnter={() => setHighlightedIndex(index)}>
                <img
                  src={book.url_avatar}
                  alt={book.title}
                  className={`${styles['book-cover']} flex-shrink-0 object-fit-cover`}
                />
                <div className={`d-flex flex-column overflow-hidden`}>
                  <div
                    className={`${styles['book-title']} fw-bold fs-6 mb-1 overflow-hidden text-nowrap`}>
                    {book.title}
                  </div>
                  <div className={styles['book-author']}>
                    Tác giả: {book.author}
                  </div>
                  <div className={styles['book-meta']}>
                    <span className='text-nowrap'>
                      Cập nhật: {book.updatedAt}
                    </span>
                    <span className='text-nowrap'>
                      Số chương: {book.chapterCount}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default SearchBar
