import React, {useEffect} from 'react';
import album from '../../assets/album.png';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopTenTracks } from '../features/topTenTracksSlice';

const TopAlbum = () => {
  // const dispatch = useDispatch();
  const songs = useSelector((state) => state.topTenTracks.songs);
  const status = useSelector((state) => state.topTenTracks.status);

  // useEffect(() => {
  //   // Dispatch the fetchSongs async thunk when the component mounts
  //   if (status === 'idle') {
  //     dispatch(fetchTopTenTracks());
  //   }
    
  // }, [dispatch, status]);

  return (
    <div className="topAlbum">
      <h3>MOST PLAYED ALBUM</h3>
      <div className="albumCard">
        <img src={album} alt="image" />
        <h4>{songs[0]?.artist} <br /> {songs[0]?.album}</h4>
      </div>
    </div>
  )
}

export default TopAlbum;

