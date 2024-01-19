import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client';
import NavbarComp from '../components/NavbarComp.jsx';
import TopTracksComp from '../components/TopTracksComp.jsx';
import TopAlbumComp from '../components/TopAlbumComp.jsx';
import GraphComp from '../components/GraphComp.jsx';
import LogStateComp from '../components/LogStateComp.jsx';
import YearSliderComp from '../components/SliderComp.jsx';
// s
// import DisplayYear from '../components/DisplayYear.jsx';
import TopArtistsByYearComp from '../components/TopAristsByYearComp.jsx';
import { fetchTopArtists } from '../features/slice.js';
import '../../styles/index.scss';
import { useSelector, useDispatch } from 'react-redux';

export function App() {
const { year } = useSelector(state => state.chosen);
const dispatch = useDispatch();

useEffect(() => {
  dispatch(fetchTopArtists());
}, []);

  return (
    <>
      <LogStateComp/>
      <NavbarComp/>
      <YearSliderComp/>
      <div className="trackListAndAlbum">
      <TopTracksComp/>
      {/* <TopAlbumComp/> */}
      </div>
      <TopArtistsByYearComp/>
      <GraphComp/>
    </>
  )
}

// This exports the entire file "App" or module.
export default App;
