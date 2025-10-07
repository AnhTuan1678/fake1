import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { progressAPI } from '../services/api' // import hàm mới
import StoryCard from '../components/StoryCard'
import NotifyBlock from '../components/NotifyBlock'
import { formatterStoryDetail } from '../utils/formatter'
import Pagination from '../components/Pagination'
import GuestNotice from '../components/GuestNotice'

const RecentlyRead = () => {
  const [stories, setStories] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 36

  const user = useSelector((state) => state.user)

  useEffect(() => {
    const fetchHistoryStories = async (currentPage) => {
      if (!user.token) return
      try {
        const offset = (currentPage - 1) * limit
        const res = await progressAPI.getMyProgress(user.token, {
          limit,
          offset,
        })

        if (res && Array.isArray(res.data)) {
          setStories(res.data)
          setTotal(res.total || res.data.length)
        } else {
          setStories([])
          setTotal(0)
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (err) {
        console.error('Lỗi khi tải tiến trình truyện:', err)
      }
    }

    fetchHistoryStories(page)
  }, [page, user.token])

  if (!user.isLoggedIn) {
    return <GuestNotice />
  }

  return (
    <>
      <h2 className='m-3 fs-3 fw-normal text-blue'>
        {import.meta.env.VITE_APP_NAME} - Truyện đã đọc {'>'}
      </h2>

      {stories?.length === 0 ? (
        <div className='d-flex justify-content-center align-items-center flex-grow-1 text-center'>
          <p className='text-muted'>Bạn chưa đọc truyện nào</p>
        </div>
      ) : (
        <div className='row ps-1 pe-1'>
          {stories.map((book) => (
            <StoryCard key={book.id} story={formatterStoryDetail(book.Book)} />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={Math.ceil(total / limit) || 1}
        onChangePage={(p) => setPage(p)}
      />
    </>
  )
}

export default RecentlyRead
