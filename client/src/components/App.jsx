import React from 'react'
import ReactDOM from 'react-dom/client';
import Navbar from './Navbar.jsx';
import SongList from './SongList.jsx';
import TopAlbum from './TopAlbum.jsx';
import '../../styles/index.scss';

export function App() {
  return (
    <>
      <Navbar/>
      <h3>Lets take a trip down memory lane</h3>
      <h1 className="gradientHeader">This is your all time favorites</h1>
      <div className="songListAndAlbum">
      <SongList/>
      <TopAlbum/>
      </div>
    </>
  )
}

// This exports the entire file "App" or module.
export default App;