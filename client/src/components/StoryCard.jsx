import { useNavigate } from 'react-router-dom'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import styles from './StoryCard.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHeart,
  faBookmark,
  faEye,
  faUser,
  faList,
  faClock,
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { timeAgo } from '../utils/timeAgo'

const StoryCard = ({ story, className }) => {
  const [hover, setHover] = useState(false)
  const navigate = useNavigate()

  const popupContent = (
    <div className={`${styles['story-info-popup']} d-flex flex-column`}>
      <div className='d-flex'>
        <div className='d-flex justify-content-center align-items-center'>
          <img
            src={story.urlAvatar}
            alt={story.title}
            className={`${styles['card-img']}`}
          />
        </div>
        <div className='d-flex flex-column p-2 ps-4'>
          <h5 className={`fs-6 text-success ${styles['limit-2-lines']}`}>
            {story.title}
          </h5>
          <p className='fs-7'>
            <FontAwesomeIcon icon={faUser} />
            {story.author}
          </p>
          <p className='fs-8 fw-light fst-italic'>{story.genres.join(', ')}</p>
          <p>
            <FontAwesomeIcon icon={faList} />
            {story.chapterCount} chương
          </p>
          <div>
            <span className={`p-0 m-0 me-3`}>
              <FontAwesomeIcon icon={faHeart} /> {story.like}
            </span>
            <span className={`p-0 m-0 me-3`}>
              <FontAwesomeIcon icon={faBookmark} /> {story.followers}
            </span>
            <span className={`p-0 m-0 me-3`}>
              <FontAwesomeIcon icon={faEye} /> {story.views}
            </span>
            <span className={`p-0 m-0 me-3`}>
              <FontAwesomeIcon icon={faClock} /> {timeAgo(story.updateAt)}
            </span>
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
        offset={[-200, -10]}
        maxWidth={400}
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
              <div
                className='ratio ratio-2x3 bg-cover bg-center'
                style={{
                  backgroundImage: `url(${story.urlAvatar})`,
                }}></div>
            )}

            {story?.chapters?.length === 1 && (
              <div
                className={`card-img-overlay d-flex flex-column justify-content-end p-1 ${styles['story-chapter']}`}>
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
            <p className={`fs-7 text-center p-1 ${styles['limit-2-lines']}`}>
              {story.title}
            </p>
          </div>
        </div>
      </Tippy>
    </div>
  )
}

export default StoryCard
