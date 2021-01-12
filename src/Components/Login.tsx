import React from 'react';

export default function Login() {
  return (
    <div className='login'>
      <h1>Spotify Lyrics</h1>
      <a
        href='https://spotify-lyrics.now.sh/api/login'
        className='button-login'
      >
        Log in to Spotify
      </a>
    </div>
  );
}
