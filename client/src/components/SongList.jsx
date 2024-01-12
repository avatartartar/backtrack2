import React, { useEffect } from 'react';
import logo from '../../assets/logo.png';
import { fetchTopTenTracks } from '../features/topTenTracksSlice.js';
// import store from '../store/store.js';
import { useDispatch, useSelector } from 'react-redux';

const SongList = () => {

  const dispatch = useDispatch();
  const songs = useSelector((state) => state.topTenTracks.songs);
  const status = useSelector((state) => state.topTenTracks.status);

  useEffect(() => {
    // Dispatch the fetchSongs async thunk when the component mounts
    if (status === 'idle') {
      dispatch(fetchTopTenTracks());
    }
  }, [dispatch, status]);

  // store.dispatch(topTenTracksSlice());

  // const songs = useSelector(getTopTenTracks);
  // const status = useSelector(getTopTenTracksStatus);
  // const error = useSelector(getTopTenTracksError);

  return (
    <div className="SongList">
      <h3>TOP 10 SONGS</h3>
      <ul>
        <li>Sweet Home Alabama - Lyndyr Skynyrd</li>
        <li>Sweet Home Alabama - Lyndyr Skynyrd</li>
        <li>Sweet Home Alabama - Lyndyr Skynyrd</li>
        <li>Sweet Home Alabama - Lyndyr Skynyrd</li>
        <li>Sweet Home Alabama - Lyndyr Skynyrd</li>
        <li>Sweet Home Alabama - Lyndyr Skynyrd</li>
        <li>Sweet Home Alabama - Lyndyr Skynyrd</li>
        <li>Sweet Home Alabama - Lyndyr Skynyrd</li>
        <li>Sweet Home Alabama - Lyndyr Skynyrd</li>
        <li>Sweet Home Alabama - Lyndyr Skynyrd</li>
      </ul>
    </div>
  )
}

export default SongList;

