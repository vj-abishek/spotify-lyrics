import React from 'react'
console.log(process.env)
export default function Login() {
  return (
    <div className='login'>
      <h1>Spotify Lyrics</h1>
      <a
        href={
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:8000/login'
            : process.env.REACT_APP_URL
        }
        className='button-login'
      >
        Log in to Spotify
      </a>
    </div>
  )
}
