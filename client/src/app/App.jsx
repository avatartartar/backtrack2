import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client';
import Navbar from '../components/NavbarComp.jsx';
import TopTracks from '../components/TopTracksComp.jsx';
import TopAlbum from '../components/TopAlbumComp.jsx';
import GraphComp from '../components/GraphComp.jsx';
import LogState from '../components/LogStateComp.jsx';
import YearSliderComp from '../components/SliderComp.jsx';
// s
// import DisplayYear from '../components/DisplayYear.jsx';
import TopArtistsByYearComp from '../components/TopAristsByYearComp.jsx';
import { fetchTopArtists } from '../features/slice.js';
import '../../styles/index.scss';
import { useSelector, useDispatch } from 'react-redux';

export function App() {
// const { year } = useSelector(state => state.year);
const dispatch = useDispatch();

useEffect(() => {
  dispatch(fetchTopArtists());
}, []);

  return (
    <>
      <LogState/>
      <Navbar/>
      <YearSliderComp/>
      <div className="trackListAndAlbum">
      <TopTracks/>
      <TopAlbum/>
      </div>
      <TopArtistsByYearComp/>
      <GraphComp/>
    </>
  )
}

// This exports the entire file "App" or module.
export default App;
