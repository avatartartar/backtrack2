import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client';
// import Chart from '../components/Chart.jsx';
import '../../styles/index.scss';
import { fetchTopTracksByYear } from '../features/slice.js';
import { useDispatch, useSelector } from 'react-redux';
// import { setYear } from '../features/topTenTracksByYearSlice.js';

const YearSliderComp = () => {
  const [year, setYear] = useState(2000);

  const dispatch = useDispatch();
  // const { arrData: topTracksByYear, status } = useSelector(state => state.topTracksByYear);

  function handleSliderInput(e) {
    setYear(e.target.value);
    // dispatch(fetchTopTracksByYear({value: e.target.value}));
  }

  function handleClick() {
    dispatch(fetchTopTracksByYear({query: year}));
  }

  return (
    <div className="slideContainer">
    <h1 className="topTracksByYearYear">{year}</h1>
      <input type="range" min="2000" max="2024" onMouseUp={handleClick} className="slider" name='slider' onChange={(e) => (
        handleSliderInput(e)
      )} />
    </div>
  )

}
export default YearSliderComp;
