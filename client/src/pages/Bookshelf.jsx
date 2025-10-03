import { useEffect, useState } from 'react'
import { getBookshelf } from '../services/api'
import StoryCard from '../components/StoryCard'
import { useSelector } from 'react-redux'

const Bookshelf = () => {
  const [stories, setStories] = useState([])

  const token = useSelector((state) => state.user.token)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await getBookshelf(token)
        setStories(data)
      } catch (err) {
        console.error('Lỗi khi tải danh sách truyện:', err)
      }
    }

    if (token) {
      fetchStories()
    }
  }, [token])

  return (
    <div className='container mt-4 flex-grow-1 d-flex'>
      {token ? (
        <div className='flex-grow-1'>
          <h2 className='mb-3'>Truyện đã lưu</h2>
          <div className='row mx-0'>
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      ) : (
        <div className='flex-grow-1 d-flex align-items-center justify-content-center'>
          <h6 className='text-center'>Bạn chưa đăng nhập</h6>
        </div>
      )}
    </div>
  )
}

export default Bookshelf
