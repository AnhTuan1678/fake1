import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { bookAPI } from '../services/api'
import StoryCard from '../components/StoryCard'
import Pagination from '../components/Pagination'

const Home = () => {
  const [stories, setStories] = useState([])
  const [total, setTotal] = useState(0)
  const limit = 36

  const [searchParams, setSearchParams] = useSearchParams()

  // Đọc page từ URL (nếu không có thì = 1)
  const page = parseInt(searchParams.get('page')) || 1

  // --- Fetch truyện mỗi khi page (URL) thay đổi ---
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const offset = (page - 1) * limit
        const res = await bookAPI.getAllStory({ limit, offset })
        if (res.data) {
          setStories(res.data)
          setTotal(res.total || limit)
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách truyện:', err)
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
    fetchStories()
  }, [page])

  // --- Khi đổi trang ---
  const handleChangePage = (newPage) => {
    setSearchParams({ page: newPage })
  }

  return (
    <>
      <h2 className='m-3 fs-3 fw-normal text-blue'>
        {import.meta.env.VITE_APP_NAME} - Truyện online {'>'}
      </h2>

      <div className='row ps-1 pe-1'>
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={Math.ceil(total / limit) || 1}
        onChangePage={handleChangePage}
      />
    </>
  )
}

export default Home
