import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default function LyricsComp(props: any) {
  const [error, setError] = useState(false);
  // const [track, setTrack] = useState()
  const [lyrics, setLyrics] = useState('Loading...');
  const [gotLyrics, setGotLyrics] = useState(false);
  const [songId, setId] = useState('15vzANxN8G9wWfwAJLLMCg');
  const [songName, setSongName] = useState();
  const [tried, setTried] = useState(true);

  useEffect(() => {
    //
    if (gotLyrics === false) {
      const fetchSong = () => {
        if (gotLyrics) return;
        axios
          .get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
              Authorization: `Bearer ${localStorage.access_token}`,
            },
          })
          .then((data) => {
            // https://lyric-api.herokuapp.com/api/find/artist/song
            const da: any = data.data;
            const name: any = da.item.name;
            const artist: any = da.item.album.artists[0].name;
            if (gotLyrics === false && tried === true) {
              axios
                .get(
                  `https://lyric-api.herokuapp.com/api/find/${artist}/${name}`
                )
                .then((data) => {
                  setSongName(name);
                  setLyrics(data.data.lyric);

                  if (data.data.err !== 'none') {
                    if (data.status === 200 && gotLyrics === false) {
                      console.log(da);
                      if (da.is_playing) {
                        setSongName(name);
                        console.log(name);
                        axios
                          .get(`https://spotify-server.now.sh/track/${name}`)
                          .then((data) => {
                            const id =
                              data.data.message.body.track_list[0].track
                                .track_id;

                            console.log(id);
                            axios
                              .get(`https://spotify-server.now.sh/lyrics/${id}`)
                              .then((data) => {
                                try {
                                  const das: any = data;
                                  const lyrc: any =
                                    das.data.message.body.lyrics.lyrics_body;

                                  setLyrics(lyrc);
                                  setGotLyrics(true);
                                } catch (err) {
                                  setError(true);
                                }
                              });
                            // setTrack(da)
                          })
                          .catch((err) => {
                            setError(true);
                          });
                      }
                    }
                  } else {
                    setGotLyrics(true);
                  }
                })
                .catch(() => setTried(false));
            } else {
              console.log('Im here heheh');
              let dummy: any = 'Cannot find the lyrics';
              setLyrics(dummy);
              setGotLyrics(true);
            }
          })
          .catch((err) => {
            setError(true);

            axios
              .get(
                `https://spotify-server.now.sh/refresh_token#refresh_token=${localStorage.refresh_token}`
              )
              .then((data) => {
                console.log(data);
                if (data) {
                  localStorage.access_token = data;
                }
              });
          });
      };

      const parsedHash: any = queryString.parse(props.location.hash);
      if (localStorage.access_token) {
        console.log('Im here');
        fetchSong();
        axios
          .get(`https://api.spotify.com/v1/me/player/recently-played?limit=1`, {
            headers: {
              Authorization: `Bearer ${localStorage.access_token}`,
            },
          })
          .then((data) => {
            let recentSong: any = data.data.items[0].track.id;
            console.log(recentSong);
            setId(recentSong);
          });
      } else {
        localStorage.setItem('access_token', parsedHash.access_token);
        localStorage.setItem('refresh_token', parsedHash.refresh_token);
        fetchSong();
      }
    } else {
      return;
    }
  }, [props.location.hash, gotLyrics, tried]);

  return error ? (
    <h1 style={{ textAlign: 'center' }}>
      {!localStorage.access_token ? <Redirect to='/' /> : ''}
      Try to play song and come here or an error has occured.
    </h1>
  ) : (
    <div className='login' style={{ margin: '0 auto' }}>
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
                  textAlign: 'center',
                }}
                key={index}
              >
                {i}
              </p>
            );
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
  );
}
