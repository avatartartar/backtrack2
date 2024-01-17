import React, {useEffect} from 'react';
import albumImagePlaceholder from '../../assets/album.png';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopTracks } from '../features/slice';

const TopAlbumComp = () => {
  // const dispatch = useDispatch();
  // const tracks = useSelector((state) => state.topTenTracks.tracks);
  // const status = useSelector((state) => state.topTenTracks.status);
  const { arrData: topAlbum, status } = useSelector(state => state.topTracksByYear);

  // useEffect(() => {
  //   // Dispatch the fetchTracks async thunk when the component mounts
  //   if (status === 'idle') {
  //     dispatch(fetchTopTracks());
  //   }

  // }, [dispatch, status]);

  return (
    <div className="topAlbum">
      <h3>MOST PLAYED ALBUM</h3>
      <div className="albumCard">
        <img src={albumImagePlaceholder} alt="image" />
        <h4>{topAlbum[0]?.artist} <br /> {topAlbum[0]?.album}</h4>
      </div>
    </div>
  )
}

export default TopAlbumComp;
