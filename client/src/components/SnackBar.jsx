import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faExclamationCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css'

const Snackbar = ({ status = 'success', message = '', onClose }) => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      if (onClose) onClose()
    }, 2000) // 1 giây
    return () => clearTimeout(timer)
  }, [onClose])

  if (!show) return null

  // Chọn màu và icon dựa trên status
  let bgClass = 'bg-success'
  let icon = faCheckCircle

  if (status === 'error') {
    bgClass = 'bg-danger'
    icon = faTimesCircle
  } else if (status === 'warning') {
    bgClass = 'bg-warning'
    icon = faExclamationCircle
  }

  return (
    <div
      className={`toast show position-fixed ${
        window.innerWidth < 768 ? 'bottom-0 end-0' : 'top-0 end-0'
      } m-3 ${bgClass} text-white`}
      role='alert'
      aria-live='assertive'
      aria-atomic='true'
      style={{ minWidth: '250px', zIndex: 9999 }}>
      <div className='d-flex'>
        <div className='toast-body d-flex align-items-center'>
          <FontAwesomeIcon icon={icon} className='me-2' />
          {message}
        </div>
        <button
          type='button'
          className='btn-close btn-close-white me-2 m-auto'
          aria-label='Close'
          onClick={() => setShow(false)}></button>
      </div>
    </div>
  )
}

export default Snackbar
