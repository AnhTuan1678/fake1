import { useEffect, useState } from 'react'
import { getBookshelf } from '../services/api'
import StoryCard from '../components/StoryCard'

const Bookshelf = () => {
  const [stories, setStories] = useState([])
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await getBookshelf(token)
        setStories(data)
      } catch (err) {
        console.error('Lỗi khi tải danh sách truyện:', err)
      }
    }

    fetchStories()
  }, [token])

  return (
    <div className='container mt-4 flex-grow-1'>
      <h2 className='mb-3'>Truyện đã lưu</h2>
      <div className='row'>
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  )
}

export default Bookshelf
