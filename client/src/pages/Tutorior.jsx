import { useEffect, useState } from 'react'

const GenreList = ({ genres }) => {
  return (
    <div className='container mt-4'>
      <div className='card'>
        <div className='card-header'>Genres</div>
        <ul className='list-group list-group-flush'>
          {genres.map((genre, index) => (
            <li key={index} className='list-group-item'>
              <h6 className='bg-light p-2'>{genre.name}</h6>
              <p>{genre.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const Tutorial = () => {
  const url = 'http://127.0.0.1:3000/public/json/genres.json'
  const [genres, setGenres] = useState([])

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(url)
        const _genres = await res.json()
        setGenres(_genres)
      } catch (err) {
        console.error('Failed to fetch genres:', err)
      }
    }
    fetchGenres()
  }, [])

  return <div>{genres.length > 0 && <GenreList genres={genres} />}</div>
}

export default Tutorial
