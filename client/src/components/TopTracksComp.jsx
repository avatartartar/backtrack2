import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import { fetchTopTracks } from '../features/slice.js';
// import store from '../store/store.js';
import { useDispatch, useSelector } from 'react-redux';
import playIcon from '../../assets/play_icon.png';
import pauseIcon from '../../assets/pause_icon.png';


const TopTracksComp = () => {
  const dispatch = useDispatch();
  const [audio, setAudio] = useState(null);
  const [isClickedId, setIsClickedId] = useState(null);
  const [endClipTimeout, setEndClipTimeout] = useState(null);


  // KG 2024-01-14_03-20-PM: consolidated tracks, status, and error into one object.
  const { arrData: topTracks, status, error } = useSelector(state => state.topTracks);
  // console.log('tracks', topTracks);
  console.log('status in topTracksComp from reducer:', status)

  if (status === 'loading') {
    // console.log('loading tracks from state in TopTracksComp.jsx');
  }

  if (status === 'failed') {
    console.log('FAILED: loading tracks from state in topTracksComp.jsx');
  }

  if (error) {
    console.log('ERROR: loading tracks from state in TopTracksComp.jsx');
  }


  useEffect(() => {
    // Dispatch the fetchTracks async thunk when the component mounts
    if (status === 'idle') {
      dispatch(fetchTopTracks());
    }
  }, [dispatch, status]);


   const controlAudio = (previewUrl, trackId) => {

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
      setIsClickedId(trackId);
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
          setIsClickedId(null);
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

  // Keith 2024-01-14_03-27-PM: changed the key 'preview' to 'audio_clip_url' for specificity.

  return (
    <div className="TopTracks">
      <h3>TOP 10 TRACKS</h3>
      <ul>
        {topTracks.map(track => (
          <li key={track.id}>
            <img src={playIcon} alt="" style={isClickedId === track.id ? {display: 'none'} : {display: 'block'}}/>
            <img src={pauseIcon} alt="" style={isClickedId === track.id ? { display: 'block' } : { display: 'none' }} />
            <div className="scrollWrapper">
              <div className={isClickedId === track.id ? 'onPlay' : 'tracks'} >
                <div onClick={() => controlAudio(track.audio_clip_url, track.id)}>
                {track.name} - {track.artist_name}
                </div>
                <div onClick={() => controlAudio(track.audio_clip_url, track.id)}>
                {track.name} - {track.artist_name}
                </div>
              </div>
            </div>
          </li>
          ))}
      </ul>
    </div>
  )
}

export default TopTracksComp;
