import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import styles from './SearchBar.module.css'
import { searchBooks } from '../services/api'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({ className, onSearch }) => {
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

  // Gọi API
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
      if (onSearch) onSearch(data)
      setHighlightedIndex(-1) // reset highlight khi search mới
    }

    fetchData()
  }, [debouncedQuery, onSearch])

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
    if (onSearch) onSearch([book])
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
    <div className={`${styles.wrapper} ${className}`} ref={wrapperRef}>
      <form
        className={styles['search-bar']}
        onSubmit={(e) => e.preventDefault()}>
        <input
          type='text'
          className={styles['search-input']}
          placeholder='Tìm kiếm...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown} // <-- thêm
        />
        <button type='submit' className={styles['search-btn']}>
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faSearch} />
          </div>
        </button>
      </form>

      {showDropdown && results.length > 0 && (
        <ul className={styles['dropdown']}>
          {results.map((book, index) => (
            <li
              key={book.id}
              className={`${styles['dropdown-item']} ${
                index === highlightedIndex ? styles.highlighted : ''
              }`}
              onClick={() => handleSelect(book)}
              onMouseEnter={() => setHighlightedIndex(index)}>
              <img
                src={book.url_avatar}
                alt={book.title}
                className={styles['book-cover']}
              />
              <div className={styles['book-info']}>
                <div className={styles['book-title']}>{book.title}</div>
                <div className={styles['book-author']}>
                  Tác giả: {book.author}
                </div>
                <div className={styles['book-meta']}>
                  <span>Cập nhật: {book.updatedAt}</span>
                  <span>Số chương: {book.chapterCount}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBar
