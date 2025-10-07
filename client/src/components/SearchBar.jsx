import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClock,
  faEye,
  faHeart,
  faList,
  faSearch,
  faStar,
} from '@fortawesome/free-solid-svg-icons'
import styles from './SearchBar.module.css'
import { bookAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { timeAgo } from '../utils/timeAgo'

const SearchBar = ({ className = '' }) => {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  const [results, setResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1) // index đang focus
  const [isClosing, setIsClosing] = useState(false)
  const wrapperRef = useRef(null)

  const navigate = useNavigate()

  // Debounce query
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(handler)
  }, [query])

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      closeDropdown()
      return
    }

    if (debouncedQuery.trim().length < 2) return

    const fetchData = async () => {
      const data = await bookAPI.searchBooks({ query: debouncedQuery })
      if (data.length === 0) {
        closeDropdown()
        return
      }
      console.log(data)
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
        closeDropdown()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Chọn sách
  const handleSelect = (book) => {
    setQuery('')
    closeDropdown()
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

  const closeDropdown = () => {
    setIsClosing(true)
    const lastRes = results
    setTimeout(() => {
      if (lastRes === results) {
        setShowDropdown(false)
        setResults([])
        setIsClosing(false)
      }
    }, 300)
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
        className='d-flex align-items-center w-100 rounded-pill overflow-hidden rounded-t-3 p-1 pb-0'
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
        className='position-absolute start-0 end-0 p-0 m-0 overflow-hidden bg-transparent'
        style={{
          backgroundColor: 'inherit',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
        }}>
        {(showDropdown || isClosing) && (
          <ul
            className={`show p-0 overflow-hidden m-0 animate__animated animate__faster ${
              isClosing ? 'animate__fadeOutUp' : 'animate__fadeInDown'
            }`}>
            {results.map((book, index) => (
              <li
                key={book.id}
                className={`${styles['dropdown-item']} ${
                  index === highlightedIndex ? styles.highlighted : ''
                } d-flex align-items-center gap-2 p-1 cursor-pointer border-top border-secondary`}
                onClick={() => handleSelect(book)}
                onMouseEnter={() => setHighlightedIndex(index)}>
                <img
                  src={book.urlAvatar}
                  alt={book.title}
                  className={`${styles['book-cover']} flex-shrink-0 object-fit-cover`}
                />
                <div className={`d-flex flex-column overflow-hidden`}>
                  <div
                    className={`${styles['book-title']} fw-semibold fs-7 mb-1 overflow-hidden text-nowrap`}>
                    {book.title}
                  </div>
                  <div className={styles['book-author']}>
                    Tác giả: {book.author}
                  </div>
                  <div className={styles['book-meta']}>
                    <span className='text-nowrap'>
                      {book.totalRating / (book.reviewCount || 1)}
                      <FontAwesomeIcon icon={faStar} color='gold' />
                    </span>
                    <span className='text-nowrap'>
                      Tình trạng: {book.status}
                    </span>
                  </div>
                  <div className={styles['book-meta']}>
                    <span className='text-nowrap'>
                      <FontAwesomeIcon icon={faClock} />
                      {timeAgo(book.updatedAt)}
                    </span>
                    <span className='text-nowrap'>
                      <FontAwesomeIcon icon={faList} />
                      {book.chapterCount}
                    </span>
                    <span className='text-nowrap'>
                      <FontAwesomeIcon icon={faEye} />
                      {book.views}
                    </span>
                    <span className='text-nowrap'>
                      <FontAwesomeIcon icon={faHeart} />
                      {book.like}
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
