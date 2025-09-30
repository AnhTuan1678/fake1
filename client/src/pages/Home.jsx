import { useEffect, useState } from 'react'
import { getAllStory } from '../services/api'
import StoryCard from '../components/StoryCard'

const Home = () => {
  const [stories, setStories] = useState([])

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await getAllStory()
        setStories(data)
      } catch (err) {
        console.error('Lỗi khi tải danh sách truyện:', err)
      }
    }

    fetchStories()
  }, [])

  return (
    <div className='container mt-4 flex-grow-1'>
      <h2 className='mb-3'>Danh sách truyện</h2>
      <div className='row'>
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  )
}

export default Home
