import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client';
import Navbar from '../components/NavbarComp.jsx';
import TopTracks from '../components/TopTracksComp.jsx';
import TopAlbum from '../components/TopAlbumComp.jsx';
import GraphComp from '../components/GraphComp.jsx';
import LogState from '../components/LogStateComp.jsx';
import YearSliderComp from '../components/SliderComp.jsx';
// import DisplayYear from '../components/DisplayYear.jsx';
import TopArtistsByYearComp from '../components/TopAristsByYearComp.jsx';
import '../../styles/index.scss';

export function App() {
  return (
    <>
      <LogState/>
      <Navbar/>
      <h3>Lets take a trip down memory lane</h3>
      {/* <h1 className="gradientHeader">This is your all time favorites</h1> */}
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
