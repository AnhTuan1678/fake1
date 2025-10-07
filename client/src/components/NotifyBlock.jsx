import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

const NotifyBlock = ({ children, color = 'primary', icon = faInfoCircle }) => {
  return (
    <div
      className={`d-flex align-items-stretch border border-${color} border-1 p-0 overflow-hidden`}>
      <div
        className={`d-flex align-items-center justify-content-center p-2 bg-${color} text-white`}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className='p-2 flex-grow-1'>
        {' '}
        <div className='align-items-start gap-2'>
          <span className='dot position-relative'>
            <span className='ping'></span>
            <span className='core bg-danger'></span>
          </span>
          <div>
            &nbsp;&nbsp;&nbsp;&nbsp;
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotifyBlock
