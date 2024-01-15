import React, { useEffect, useState } from 'react';
import { fetchTopTenTracksByYear } from '../features/topTenTracksByYearSlice.js';
import { useDispatch, useSelector } from 'react-redux';

const TopTenTracksByYear = () => {
  const [year, setYear] = useState(2000);

  const dispatch = useDispatch();
  const tracks = useSelector((state) => state.topTenTracksByYear.tracks);
  const status = useSelector((state) => state.topTenTracksByYear.status);

  function handleSliderInput(e) {
    setYear(e.target.value);
  }

  function handleClick() {
    dispatch(fetchTopTenTracksByYear(year));
  }

  return (
    <>
    <div className="sliderContainer">
      <input type="range" min="2000" max="2024" className="slider" name='slider' onChange={(e) => handleSliderInput(e)}/>
      <button className='sliderButton' onClick={handleClick}><b>{year}</b></button>
    </div>
    {/* {tracks.map(track => {return <div>{track.name}</div>})} */}
    </>
  );
}

export default TopTenTracksByYear;