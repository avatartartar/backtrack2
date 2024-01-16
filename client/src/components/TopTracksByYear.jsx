import React, { useEffect, useState, PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchTopTenTracksByYear } from '../features/topTenTracksByYearSlice.js';
import { useDispatch, useSelector } from 'react-redux';



const TopTenTracksByYear = () => {
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
    const top10ByYear = tracks.filter((track, index) =>  index < 10);
    
    const newData = top10ByYear.map((track) => ({
        name: track.track_name,
        minutes: track.ms_played,
    }));

    setData(newData);
  }, [year, tracks])

  console.log('data in toptracksperyear', data)



  return (
    <div className="topTracksByYearWrapper">
    <div className="slideContainer">
        <h1>The Year is</h1><h1 className="topTracksByYearYear">{year}</h1>
      <input type="range" min="2000" max="2024" onMouseUp={handleClick} className="slider" name='slider' onChange={(e) => (
        handleSliderInput(e)
        )}/>
      {/* <button className='sliderButton' onClick={handleClick}><b>{year}</b></button> */}
    </div>
    {/* {tracks.map(track => {return <div>{track.name}</div>})} */}
      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis dataKey="minutes" />
            <Tooltip />
            <Legend />
            <Bar dataKey="minutes" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
            {/* <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} /> */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TopTenTracksByYear;