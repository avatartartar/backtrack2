import React from 'react'
import ReactDOM from 'react-dom/client';
import Navbar from '../components/Navbar.jsx';
import SongList from '../components/SongList.jsx';
import TopAlbum from '../components/TopAlbum.jsx';
import DisplayYear from '../components/DisplayYear.jsx';
import '../../styles/index.scss';

export function App() {

  return (
    <>
      <Navbar/>
      <h3>Lets take a trip down memory lane</h3>
      <h1 className="gradientHeader">This is your all time favorites</h1>
      <div className="trackListAndAlbum">
      <SongList/>
      <TopAlbum/>
      </div>
      <div className="slideWrapper">
        <DisplayYear />
      </div>
    </>
  )
}

// This exports the entire file "App" or module.
export default App;
