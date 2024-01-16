import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client';
import Navbar from '../components/Navbar.jsx';
import SongList from '../components/SongList.jsx';
import TopAlbum from '../components/TopAlbum.jsx';
import TopTenTracksByYear from '../components/TopTracksByYear.jsx';
import '../../styles/index.scss';
import { fetchTopTenTracksByYear } from '../features/topTenTracksByYearSlice.js';
import { useDispatch, useSelector } from 'react-redux';






export function App() {
  const [year, setYear] = useState(2000);
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const tracks = useSelector((state) => state.topTenTracksByYear.tracks);
  const status = useSelector((state) => state.topTenTracksByYear.status);
  const totalState = useSelector((state) => state);
  console.log('totalstate', totalState)
  console.log(tracks, 'tracks');

  function handleSliderInput(e) {
    setYear(e.target.value);
  }

  function handleClick() {
    console.log(year, 'year inside of handleClick')
    dispatch(fetchTopTenTracksByYear(year));
  }

  useEffect(() => {
    const top10ByYear = tracks.filter((track, index) => index < 10);

    const newData = top10ByYear.map((track) => ({
      name: track.track_name,
      minutes: track.ms_played,
    }));

    setData(newData);
  }, [year, tracks])

  console.log('data in toptracksperyear', data)

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
        {/* <button className='sliderButton' onClick={handleClick}><b>{year}</b></button> */}
      </div>
      <div className="trackListAndAlbum">
      <SongList/>
      <TopAlbum/>
      </div>
      <TopTenTracksByYear/>
    </>
  )
}

// This exports the entire file "App" or module.
export default App;
