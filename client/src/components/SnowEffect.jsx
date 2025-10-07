import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Snowflake from '../assets/image/Snowflake.png'
import './SnowEffect.css'

const SnowEffect = ({ count = 30 }) => {
  const [snowflakes, setSnowflakes] = useState([])

  // khởi tạo bông tuyết ban đầu
  useEffect(() => {
    const initialSnowflakes = Array.from({ length: count }).map(() => ({
      id: Math.random().toString(36).substr(2, 9),
      left: Math.random() * 100 + 'vw',
      width: Math.random() * 20 + 10 + 'px',
      duration: Math.random() * 5 + 5 + 's',
      delay: Math.random() * 5 + 's',
    }))
    setSnowflakes(initialSnowflakes)
  }, [count])

  return createPortal(
    <div id='snow-container'>
      {snowflakes.map((flake) => (
        <img
          key={flake.id}
          src={Snowflake}
          className='snowflake'
          style={{
            left: flake.left,
            width: flake.width,
            animationDuration: flake.duration,
            animationDelay: flake.delay,
          }}
          onAnimationEnd={() => {
            // remove bông tuyết cũ và thêm bông tuyết mới
            setSnowflakes((prev) =>
              prev
                .filter((f) => f.id !== flake.id)
                .concat({
                  id: Math.random().toString(36).substr(2, 9),
                  left: Math.random() * 100 + 'vw',
                  width: Math.random() * 20 + 10 + 'px',
                  duration: Math.random() * 5 + 5 + 's',
                  delay: '0s',
                }),
            )
          }}
        />
      ))}
    </div>,
    document.body,
  )
}

export default SnowEffect
