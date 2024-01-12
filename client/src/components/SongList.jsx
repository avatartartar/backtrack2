import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import { fetchTopTenTracks } from '../features/topTenTracksSlice.js';
// import store from '../store/store.js';
import { useDispatch, useSelector } from 'react-redux';

const SongList = () => {
  const [maxWidth, setMaxWidth] = useState(0);

  const dispatch = useDispatch();
  const songs = useSelector((state) => state.topTenTracks.songs);
  const status = useSelector((state) => state.topTenTracks.status);

  useEffect(() => {
    // Dispatch the fetchSongs async thunk when the component mounts
    if (status === 'idle') {
      dispatch(fetchTopTenTracks());
    }
  }, [dispatch, status]);

  useEffect(() => {
      setMaxWidth(setMaxDivWidth());
  }, [songs]);

  function setMaxDivWidth() {
    let maxWidth = 0;
    const divs = document.querySelectorAll('.songs');
    divs.forEach(div => {
      const width = div.offsetWidth;
      if (width > maxWidth) maxWidth = width;
    });
    return maxWidth
  }

  return (
    <div className="SongList">
      <h3>TOP 10 SONGS</h3>
      <ul>
        {songs.map(song => <li key={song.id}><div className="songs" style={{width: `${maxWidth}px`}}>{song.track} - {song.artist}</div></li>)}
      </ul>
    </div>
  )
}

export default SongList;

