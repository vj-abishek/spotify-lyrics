import React, { useEffect, useState } from 'react'
import queryString from 'query-string'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

export default function LyricsComp(props: any) {
  const [error, setError] = useState(false)
  const [track, setTrack] = useState()
  const [lyrics, setLyrics] = useState('Loading...')
  const [gotLyrics, setGotLyrics] = useState(false)
  const [songId, setId] = useState('15vzANxN8G9wWfwAJLLMCg')
  const [songName, setSongName] = useState()

  useEffect(() => {
    const parsedHash: any = queryString.parse(props.location.hash)
    if (localStorage.access_token) {
      // console.log('Im here')
      fetchSong()
      axios
        .get(`https://api.spotify.com/v1/me/player/recently-played?limit=1`, {
          headers: {
            Authorization: `Bearer ${localStorage.access_token}`
          }
        })
        .then(data => {
          let recentSong: any = data.data.items[0].track.id
          // console.log(recentSong)
          setId(recentSong)
        })
    } else {
      localStorage.setItem('access_token', parsedHash.access_token)
      localStorage.setItem('refresh_token', parsedHash.refresh_token)
      fetchSong()
    }
  }, [props.location.hash])

  const fetchSong = () => {
    axios
      .get('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`
        }
      })
      .then(data => {
        if (data.status === 200) {
          const da: any = data.data
          // console.log(da)
          if (da.is_playing) {
            // console.log(data)

            const name: any = da.item.name
            setSongName(name)
            // console.log(name)
            axios
              .get(
                `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?q_track=${name}&apikey=${process.env.REACT_APP_API_KEY}&page_size=3&page=1&s_track_rating=desc`
              )
              .then(data => {
                const da: any = data
                const id = data.data.message.body.track_list[0].track.track_id

                // console.log(id)
                axios
                  .get(
                    `https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${id}&apikey=${process.env.REACT_APP_API_KEY}`
                  )
                  .then(data => {
                    try {
                      const da: any = data
                      const lyrc: any = da.data.message.body.lyrics.lyrics_body

                      setLyrics(lyrc)
                      setGotLyrics(true)
                    } catch (err) {
                      setError(true)
                    }
                  })
                setTrack(da)
              })
              .catch(err => {
                setError(true)
              })
          }
        } else {
          // console.log('Im here heheh')
          let dummy: any = 'Try to play the song'
          setLyrics(dummy)
          setGotLyrics(true)
        }
      })
      .catch(err => {
        setError(true)

        axios
          .get(
            `http://localhost:8000/refresh_token#refresh_token=${localStorage.refresh_token}`
          )
          .then(data => console.log(data))
      })
  }

  return error ? (
    <h1 style={{ textAlign: 'center' }}>
      {!localStorage.access_token ? <Redirect to='/' /> : ''}
      An error occured. Try again
    </h1>
  ) : (
    <div className='login' style={{ margin: '0 auto' }}>
      {' '}
      {gotLyrics ? (
        <>
          <h2>{songName} : </h2>

          {lyrics.split('\n').map((i, index) => {
            return (
              <p
                style={{
                  margin: '30 auto',
                  fontSize: '26px',
                  padding: '5px',
                  textAlign: 'center'
                }}
                key={index}
              >
                {i}
              </p>
            )
          })}
          <a className='button-login' href='/lyrics'>
            refresh
          </a>
          <h2>Recently played</h2>
          <iframe
            title='Recently Played Song'
            src={`https://open.spotify.com/embed/track/${songId}`}
            width='300'
            height='380'
            frameBorder='0'
            allow='encrypted-media'
          ></iframe>
        </>
      ) : (
        ''
      )}
    </div>
  )
}
