import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { bookshelfAPI } from '../services/api'
import StoryCard from '../components/StoryCard'
import NotifyBlock from '../components/NotifyBlock'

const Bookshelf = () => {
  const [stories, setStories] = useState([])
  const [total, setTotal] = useState(0)
  const limit = 30
  const [page, setPage] = useState(1)

  const token = useSelector((state) => state.user.token)

  useEffect(() => {
    const fetchStories = async (currentPage) => {
      if (!token) return
      try {
        const offset = (currentPage - 1) * limit
        const res = await bookshelfAPI.getBookshelf(token, { limit, offset })
        if (res.data) {
          setStories(res.data)
          setTotal(res.total || 0)
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách truyện:', err)
      }
    }
    fetchStories(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page, token])

  const totalPages = Math.ceil(total / limit) || 1

  if (!token) {
    return (
      <div className='d-flex align-items-center justify-content-center flex-grow-1 text-center'>
        <h6 className='p-0 m-0'>Bạn chưa đăng nhập</h6>
      </div>
    )
  }

  return (
    <>
      <h2 className='m-3 fs-3 fw-normal text-blue'>Truyện đã lưu</h2>

      <div className='row ps-1 pe-1'>
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>

      {/* Pagination */}
      <div className='d-flex justify-content-center my-4'>
        <nav>
          <ul className='pagination'>
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className='page-link' onClick={() => setPage(page - 1)}>
                &laquo;
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
              .map((p) => (
                <li
                  key={p}
                  className={`page-item ${p === page ? 'active' : ''}`}>
                  <button className='page-link' onClick={() => setPage(p)}>
                    {p}
                  </button>
                </li>
              ))}

            <li
              className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
              <button className='page-link' onClick={() => setPage(page + 1)}>
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}

export default Bookshelf
