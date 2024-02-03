/**
 * @file TopTracksComp.jsx
 * @description: Displays the top tracks component and manages playback.
 * It allows users to play a preview of the tracks, and displays the currently chosen track's title, artist, album, and album image.
 * @requires react: For building the component using React hooks and lifecycle.
 * @requires react-redux: To dispatch actions and select parts of the state from the Redux store.
 * @imports
 * - '../../assets/play_icon.png': Play button icon for the track list.
 * - '../../assets/pause_icon.png': Pause button icon for the track list.
 * - '../features/slice.js': It imports the setChosenTrack action to update the currently selected track in the Redux store.
 * @methods
 * - controlImage: Dispatches the setChosenTrack action with the selected track's details.
 * - controlPlayback: Manages the playback of the track preview, including playing, pausing, and fading the audio in and out.
 * - TrackElement: A functional component that renders an individual track item, handling its play/pause functionality and visual feedback.
 * @consumers
 * - client/src/app/App.jsx
 */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import playIcon from '../../assets/play_icon.png';
import pauseIcon from '../../assets/pause_icon.png';
import { setChosenTrack} from '../features/slice.js';
import { selectTopTracks } from '../features/slice.js';
import { useData } from './DataContext.jsx';


const TopTracksComp = () => {
  const { jsonDb } = useData();

  const {
    year,
    default: defaultYear,
    status: statusYear,
    error: errorYear
  } = useSelector(state => state.chosen);

  const {
    name: chosenTrack,
    image_url: chosenTrackImage,
    artist_name: chosenTrackArtistName,
    album_name: chosenTrackAlbumName,
  } = useSelector(state => state.chosen.track);

  // const { arrData: topTracks, status: statusTopTracks, error: errorTopTracks } = useSelector(state => state.topTracks);

  const topTracks = useSelector(selectTopTracks);
  // setting tracks to either topTracks or topTracksByYear depending on the year selected.
  // then this gets served to the component that renders the tracks.

  const dispatch = useDispatch();
  const [audio, setAudio] = useState(null);
  const [isClickedId, setIsClickedId] = useState(null);
  const [endClipTimeout, setEndClipTimeout] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const controlImage = (track) => {
    console.log('controlImage in TopTracksComp.jsx');
    dispatch(setChosenTrack(track))
  }

const controlPlayback = (preview_url, trackId, imageUrl, albumName, artistName) => {

    // For now, in the cases when the preview_url is null as it sometimes is. 2024-01-12_05-10-PM PST.
    if (!preview_url) return;

    if (audioPlaying){
      audio.pause()
      setAudioPlaying(false);
    }

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

    if (isClickedId === trackId && audio) {
      fadeAudio(audio, -0.005, 125, () => {
        audio.pause();
        setAudioPlaying(false);
        audio.currentTime = 0;
        setIsClickedId(null);
      });
      return;
    }

    setIsClickedId(trackId);

    // function to fade the audio in or out


    const playAudio = () => {
      setIsClickedId(trackId);
      const newAudio = new Audio(preview_url);
      newAudio.volume = 0.0;
      newAudio.play();
      setAudioPlaying(true);

      // Fade in audio
      fadeAudio(newAudio, 0.005, 125);

      // Start fading out after 28 seconds, as the clips are 30 seconds.
      const endClipTimeout = setTimeout(() => {
        fadeAudio(newAudio, -0.005, 125, () => {
          newAudio.pause();
          setAudioPlaying(false);
          newAudio.currentTime = 0;
          setIsClickedId(null);
        });
      }, 20000);

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
        setAudioPlaying(false);
        audio.currentTime = 0;
      });

      setTimeout(playAudio, 1000); // 1 second delay
    } else {
      playAudio();
      setAudioPlaying(true);
    }
  }




  function TrackElement({ track, controlPlayback, controlImage, isClickedId, setIsClickedId }) {
    return (
      <li>
        <img src={playIcon} alt="" style={isClickedId === track.id ? {display: 'none'} : {display: 'block'}}/>
        <img src={pauseIcon} alt="" style={isClickedId === track.id ? { display: 'block' } : { display: 'none' }} />
        <div className="trackScrollWrapper">
          <div className={isClickedId === track.id ? 'onPlay' : 'tracks'} >
            <div onClick={() => {
              controlPlayback(track.preview_url, track.id, track.image_url, track.album_name, track.artist_name)
              &
              controlImage(track)
              if (isClickedId === track.id) {
                setIsClickedId(null);
              } else {
                setIsClickedId(track.id);
              }
            }}>
            {track.track_name} - {track.artist_name}
            </div>
            <div onClick={() => controlPlayback(track.preview_url, track.id, track.image_url, track.album_name, track.artist_name)}>
            {track.track_name} - {track.artist_name}
            </div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <div className="TopTracksAndImageContainer">
    <div className="TopTracksContainer">
      <h3>Top 10 Tracks</h3>
      <ul>
        {topTracks.map(track => (
          <TrackElement
            key={track.id}
            track={track}
            controlPlayback={controlPlayback}
            controlImage={controlImage}
            isClickedId={isClickedId}
            setIsClickedId={setIsClickedId}
          />
        ))}
      </ul>
    </div>
    <div className="trackImage">
      <div className="trackImageCard">
        <img src={chosenTrackImage} alt="image" />
        <h4>{chosenTrackArtistName}
        <br />
        "{chosenTrackAlbumName}"</h4>
      </div>
    </div>
  </div>
  )
}

export default TopTracksComp;
