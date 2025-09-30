import { useNavigate } from 'react-router-dom'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import styles from './StoryCard.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faBookmark, faEye } from '@fortawesome/free-solid-svg-icons'

const StoryCard = ({ story }) => {
  const navigate = useNavigate()

  const popupContent = (
    <div className={`${styles['story-info-popup']} d-flex flex-column`}>
      <div className='d-flex'>
        <img
          src={story.urlAvatar}
          alt={story.title}
          className={styles['card-img']}
        />
        <div className='d-flex flex-column p-2 ps-3'>
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
    <div className='col-4 col-sm-3 col-md-2 p-1'>
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
          className={`card h-100 shadow-sm ${styles['story-card']}`}
          onClick={() => navigate(`/story/${story.id}`)}>
          {story.urlAvatar && (
            <img
              src={story.urlAvatar}
              alt={story.title}
              className='card-img-top'
              style={{ objectFit: 'cover', height: '200px' }}
            />
          )}
          <div className={styles['card-body']}>
            <p className={styles['card-title']}>{story.title}</p>
          </div>
        </div>
      </Tippy>
    </div>
  )
}

export default StoryCard
