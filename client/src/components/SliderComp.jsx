import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client';
import '../../styles/index.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopTracksByYear, fetchTopArtistsByYear, setYear } from '../features/slice.js';

const YearSliderComp = () => {

  const dispatch = useDispatch();
  const { year, status, error } = useSelector(state => state.year);

  function handleSliderInput(e) {
    dispatch(setYear(e.target.value));
    // dispatch(fetchTopTracksByYear({value: e.target.value}));
  }

  function handleClick() {
    dispatch(fetchTopArtistsByYear({query: year}));
    dispatch(fetchTopTracksByYear({query: year}));
    // dispatch other 'TopByYear' actions here
  }

  return (
    <div className="sliderContainer">
      <h1 className="topTracksByYear">Your {year ? year : 'all-time'} favorites</h1>
      <input type="range" min="2011" max="2023" onMouseUp={handleClick} className="slider" name='slider' onChange={(e) => (
        handleSliderInput(e)
      )} />
      <br></br>
    </div>
  )
}
export default YearSliderComp;
