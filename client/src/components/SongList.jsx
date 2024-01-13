import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import { fetchTopTenTracks } from '../features/topTenTracksSlice.js';
// import store from '../store/store.js';
import { useDispatch, useSelector } from 'react-redux';

const SongList = () => {
  const [maxWidth, setMaxWidth] = useState(0);

  const [audio, setAudio] = useState(null);
  const [endClipTimeout, setEndClipTimeout] = useState(null);

  const dispatch = useDispatch();
  const tracks = useSelector((state) => state.topTenTracks.tracks);
  const status = useSelector((state) => state.topTenTracks.status);


  useEffect(() => {
    // Dispatch the fetchTracks async thunk when the component mounts
    if (status === 'idle') {
      dispatch(fetchTopTenTracks());
    }
  }, [dispatch, status]);

  useEffect(() => {
      setMaxWidth(setMaxDivWidth());
  }, [tracks]);

  const setMaxDivWidth = () =>{
    let maxWidth = 0;
    const divs = document.querySelectorAll('.tracks');
    divs.forEach(div => {
      const width = div.offsetWidth;
      if (width > maxWidth) maxWidth = width;
    });
    return maxWidth
  }

  const controlAudio = (previewUrl) => {

    // For now, in the cases when the previewUrl is null as it sometimes is. 2024-01-12_05-10-PM PST.
    if (!previewUrl) return;

    // function to fade the audio in or out
    const fadeAudio = (audio, increment, delay, callback) => {
      const fade = setInterval(() => {
        if((increment > 0 && audio.volume < 0.07) || (increment < 0 && audio.volume > 0.005)){
          audio.volume += increment;
        } else {
          clearInterval(fade);

          if(callback) callback();
        }
      }, delay);
    }

    const playAudio = () => {
      const newAudio = new Audio(previewUrl);
      newAudio.volume = 0.0;
      newAudio.play();

      // Fade in audio
      fadeAudio(newAudio, 0.005, 125);

      // Start fading out after 28 seconds, as the clips are 30 seconds.
      const endClipTimeout = setTimeout(() => {
        fadeAudio(newAudio, -0.005, 125, () => {
          newAudio.pause();
          newAudio.currentTime = 0;
        });
      }, 28000);

      // Save the new audio and endClipTimeout in state
      setAudio(newAudio);
      setEndClipTimeout(endClipTimeout);
    }
    // this will
    if (audio) {
      // Stop the fade out process if it hasn't started yet
      clearTimeout(endClipTimeout);

      // Fade out
      fadeAudio(audio, -0.005, 250, () => {
        audio.pause();
        audio.currentTime = 0;
      });

      setTimeout(playAudio, 1000); // 1 second delay
    } else {
      playAudio();
    }
  }

  return (
    <div className="SongList">
      <h3>TOP 10 TRACKS</h3>
      <ul>
        {tracks.map(track => (
        <li key={track.id}>
          <div
          className="tracks"
          style={{
            width: `${maxWidth}px`,
            cursor: 'pointer'
          }}
          onClick={() => controlAudio(track.preview)}
          >
            {track.name} - {track.artist_name}
            </div>
            </li>
            ))}
      </ul>
    </div>
  )
}

export default SongList;
