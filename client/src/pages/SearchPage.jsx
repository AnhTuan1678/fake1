import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { bookAPI } from '../services/api'
import genresData from '../assets/genres.json'
import StoryCard from '../components/StoryCard'

const chapterRanges = [
  { label: 'Tất cả', min: 0, max: 1e6 },
  { label: '0 → 50', min: 0, max: 50 },
  { label: '50 → 200', min: 50, max: 200 },
  { label: '200 → 500', min: 200, max: 500 },
  { label: '> 500', min: 500, max: 1e6 },
]

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState(searchParams.get('query') || '')
  const [selectedGenres, setSelectedGenres] = useState(
    searchParams.get('genre')
      ? searchParams.get('genre').split(',').map(Number)
      : [],
  )
  const [minChapter, setMinChapter] = useState(
    searchParams.get('minChapter') ? Number(searchParams.get('minChapter')) : 0,
  )
  const [maxChapter, setMaxChapter] = useState(
    searchParams.get('maxChapter')
      ? Number(searchParams.get('maxChapter'))
      : 1e6,
  )
  const [selectedRange, setSelectedRange] = useState(() => {
    const found = chapterRanges.find(
      (r) => r.min === minChapter && r.max === maxChapter,
    )
    return found ? found.label : 'Tất cả'
  })

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const limit = 360

  useEffect(() => {
    const range = chapterRanges.find((r) => r.label === selectedRange)
    if (range) {
      setMinChapter(range.min)
      setMaxChapter(range.max)
    }
  }, [selectedRange])

  useEffect(() => {
    const newQuery = searchParams.get('query') || ''
    const newGenres = searchParams.get('genre')
      ? searchParams.get('genre').split(',').map(Number)
      : []
    const newMin = searchParams.get('minChapter')
      ? Number(searchParams.get('minChapter'))
      : 0
    const newMax = searchParams.get('maxChapter')
      ? Number(searchParams.get('maxChapter'))
      : 1e6

    setBooks([])
    setLoading(false)
    setError('')

    const handleSearch = async (e, customParams) => {
      e?.preventDefault()
      setError('')
      setLoading(true)

      const params = customParams || {
        query,
        genres: selectedGenres,
        minChapter,
        maxChapter,
      }

      try {
        const results = await bookAPI.searchBooks({
          query: params.query,
          genres: params.genres,
          minChapter: params.minChapter,
          maxChapter: params.maxChapter,
          limit,
        })
        setBooks(results)
      } catch (err) {
        setError(err.message || 'Tìm kiếm thất bại')
      } finally {
        setLoading(false)
      }
    }

    setQuery(newQuery)
    setSelectedGenres(newGenres)
    setMinChapter(newMin)
    setMaxChapter(newMax)

    const found = chapterRanges.find(
      (r) => r.min === newMin && r.max === newMax,
    )
    setSelectedRange(found ? found.label : 'Tất cả')

    if (
      newQuery ||
      newGenres.length > 0 ||
      minChapter !== 0 ||
      maxChapter !== 1e6
    ) {
      handleSearch(null, {
        query: newQuery,
        genres: newGenres,
        minChapter: newMin,
        maxChapter: newMax,
      })
    }
  }, [searchParams])

  const handleSubmit = () => {
    const range = chapterRanges.find((r) => r.label === selectedRange)
    const newParams = {}

    if (query) newParams.query = query
    if (selectedGenres.length) newParams.genre = selectedGenres.join(',')
    if (range.min > 0) newParams.minChapter = range.min
    if (range.max < 1e6) newParams.maxChapter = range.max

    if (Object.keys(newParams).length === 0) {
      navigate('/')
      return
    }
    setSearchParams(newParams)
  }

  return (
    <>
      <div className='m-0 ms-md-5 me-md-5'>
        <h2 className='fs-3 mb-3'>Tìm kiếm sách</h2>
        <SearchForm
          query={query}
          setQuery={setQuery}
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      </div>

      {/* Kết quả */}
      {loading ? (
        <div className='text-center my-4'>🔍 Đang tìm kiếm...</div>
      ) : error ? (
        <div className='text-center my-4 text-danger'>❌ {error}</div>
      ) : books.length === 0 ? (
        <div className='text-center my-4 text-muted'>
          Không tìm thấy kết quả nào.
        </div>
      ) : (
        <div className='row ps-1 pe-1'>
          {books.map((story) => (
            <StoryCard story={story} key={story.id} />
          ))}
        </div>
      )}
    </>
  )
}

const SearchForm = ({
  query,
  setQuery,
  selectedGenres,
  setSelectedGenres,
  selectedRange,
  setSelectedRange,
  onSubmit,
  loading,
  error,
}) => {
  const [showGenreLabel, setShowGenreLabel] = useState(false)

  const handleGenreToggle = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    )
  }

  const handleRangeChange = (e) => {
    setSelectedRange(e.target.value)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className='mb-4'>
      {/* Ô nhập tìm kiếm */}
      <div className='mb-2 floating-label'>
        <input
          type='text'
          placeholder=''
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='form-control'
        />
        <label>Nhập tên sách hoặc tác giả</label>
      </div>

      {/* Chọn khoảng chương */}
      <div className='mb-3'>
        <label className='form-label'>Số chương:</label>
        <select
          className='form-select w-auto d-inline-block'
          value={selectedRange}
          onChange={handleRangeChange}>
          {chapterRanges.map((r) => (
            <option key={r.label} value={r.label}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Chọn thể loại */}
      <div className='mb-3'>
        <div className='d-flex flex-wrap align-items-center gap-2 mb-2'>
          <h3 className='h6 mb-0'>Thể loại:</h3>
          {selectedGenres.map((genre) => (
            <span
              key={genre}
              className='text-decoration-underline cursor-pointer opacity-hover-50 primary-color fst-italic'
              onClick={() =>
                setSelectedGenres(selectedGenres.filter((g) => genre !== g))
              }>
              {genresData[genre - 1]?.name || '??'}
            </span>
          ))}
        </div>
        <button
          type='button'
          className='btn btn-link btn-sm'
          onClick={() => setShowGenreLabel((pre) => !pre)}>
          {showGenreLabel ? '[Ẩn]' : '[Hiện]'}
        </button>

        {showGenreLabel && (
          <div className='d-flex flex-wrap gap-2'>
            {genresData.map((g) => (
              <div key={g.id} className='form-check'>
                <input
                  type='checkbox'
                  className='form-check-input'
                  id={`genre-${g.id}`}
                  checked={selectedGenres.includes(g.id)}
                  onChange={() => handleGenreToggle(g.id)}
                />
                <label
                  className='form-check-label'
                  htmlFor={`genre-${g.id}`}
                  title={g.description}>
                  {g.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type='submit' disabled={loading} className='btn btn-primary'>
        {loading ? 'Đang tìm...' : 'Tìm kiếm'}
      </button>

      {error && <div className='text-danger mt-2'>{error}</div>}
    </form>
  )
}

export default SearchPage
