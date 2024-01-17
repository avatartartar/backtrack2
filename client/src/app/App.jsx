import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client';
import Navbar from '../components/Navbar.jsx';
import SongList from '../components/SongList.jsx';
import TopAlbum from '../components/TopAlbum.jsx';
// import Chart from '../components/Chart.jsx';
import '../../styles/index.scss';
import { fetchTopTenTracksByYear } from '../features/topTenTracksByYearSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import TopTenTracksByYear from '../components/TopTracksByYear.jsx';
import { setYear } from '../features/topTenTracksByYearSlice.js';

export function App() {
  const dispatch = useDispatch();
  const year = useSelector((state) => state.topTenTracksByYear.year)

  function handleSliderInput(e) {
    dispatch(setYear(e.target.value));
  }

  function handleClick() {
    dispatch(fetchTopTenTracksByYear(year));
  }

  return (
    <>
      <Navbar/>
      <h3>Lets take a trip down memory lane</h3>
      <div className="headerWrapper">
        <div className="favoriteMusicHeader">
        <h1 className="gradientHeader">Your favorite music of </h1>
          <div className="slideContainer">
        <h1 className="topTracksByYearYear">{year}</h1>
          <input type="range" min="2000" max="2024" onMouseUp={handleClick} className="slider" name='slider' onChange={(e) => (
            handleSliderInput(e)
          )} />
        </div>
        </div>
      </div>
      <div className="trackListAndAlbum">
      <SongList/>
      <TopAlbum/>
      </div>
      <TopTenTracksByYear/>
      {/* <Chart/> */}
    </>
  )
}

// This exports the entire file "App" or module.
export default App;
