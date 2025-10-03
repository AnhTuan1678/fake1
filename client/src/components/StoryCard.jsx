import { useNavigate } from 'react-router-dom'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import styles from './StoryCard.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faBookmark, faEye } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

const StoryCard = ({ story, className }) => {
  const [hover, setHover] = useState(false)
  const navigate = useNavigate()

  const popupContent = (
    <div className={`${styles['story-info-popup']} d-flex flex-column`}>
      <div className='d-flex'>
        <img
          src={story.urlAvatar}
          alt={story.title}
          className={styles['card-img']}
        />
        <div className='d-flex flex-column p-2 ps-4'>
          <h5>{story.title}</h5>
          <p className='fst-italic fs-6'>{story.author}</p>
          <p>{story.chapterCount} chương</p>
          <div>
            <div className={`btn ${styles['cus-btn']}`}>
              <FontAwesomeIcon icon={faHeart} /> {story.like}
            </div>
            <div className={`btn ${styles['cus-btn']}`}>
              <FontAwesomeIcon icon={faBookmark} /> {story.followers}
            </div>
            <div className={`btn ${styles['cus-btn']}`}>
              <FontAwesomeIcon icon={faEye} /> {story.views}
            </div>
          </div>
        </div>
      </div>
      <p>{story.description}</p>
    </div>
  )

  return (
    <div className={`col-4 col-sm-3 col-md-2 p-1 ${className}`}>
      <Tippy
        content={popupContent}
        placement='right'
        interactive={false}
        delay={[100, 0]}
        offset={[50, -90]}
        maxWidth={500}
        arrow={true}
        animation='fade'>
        <div
          className={`cursor-pointer overflow-hidden animate__animated animate__faster ${
            hover ? 'animate__pulse' : ''
          }`}
          onClick={() => navigate(`/story/${story.id}`)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}>
          <div className='card text-white'>
            {story.urlAvatar && (
              <img
                src={story.urlAvatar}
                alt={story.title}
                className='p-0 m-0'
              />
            )}

            {story?.chapters?.length === 1 && (
              <div className='card-img-overlay d-flex flex-column justify-content-end p-1 bg-dark bg-opacity-25'>
                <ul className='list-group list-group-flush'>
                  {story.chapters.map((chapter) => (
                    <li
                      key={chapter.id}
                      className={`list-group-item bg-transparent text-no-wrapper text-truncate text-white border-0 p-0 ${styles['card-title']}`}>
                      {chapter.index}. {chapter.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className={`p-0`}>
            <p
              className={`fs-6 text-center p-1 mb-3 fw-bold`}>
              {story.title}
            </p>
          </div>
        </div>
      </Tippy>
    </div>
  )
}

export default StoryCard
