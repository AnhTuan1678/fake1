import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStar as faStarSolid,
  faStarHalfAlt,
  faStar as faStarEmpty,
} from '@fortawesome/free-solid-svg-icons'

export const StarRating = ({ rating = 0, totalStars = 5 }) => {
  const roundedRating = Math.round(rating * 2) / 2
  const fullStars = Math.floor(roundedRating)
  const hasHalfStar = roundedRating - fullStars === 0.5
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <span>
      {Array.from({ length: fullStars }).map((_, i) => (
        <FontAwesomeIcon
          key={`full-${i}`}
          icon={faStarSolid}
          style={{ color: '#ffc107' }}
        />
      ))}
      {hasHalfStar && (
        <FontAwesomeIcon icon={faStarHalfAlt} style={{ color: '#ffc107' }} />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <FontAwesomeIcon
          key={`empty-${i}`}
          icon={faStarEmpty}
          style={{ color: '#f4f4f4' }}
        />
      ))}
      <span className='ms-1'>({rating.toFixed(1)})</span>
    </span>
  )
}
