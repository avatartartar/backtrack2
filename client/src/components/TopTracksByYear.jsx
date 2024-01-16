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

  function CustomTooltip({ payload, label, active }) {
    console.log(payload, 'payload');
    if (active) {
      return (
        <div className="custom-tooltip" style={{background: 'green'}}>
          <p className="label">{payload[0].payload.name}</p>
          <p className="desc">{payload[0].payload.minutes}</p>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="topTracksByYearWrapper">
    {/* {tracks.map(track => {return <div>{track.name}</div>})} */}
      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="0 0" />
            <XAxis dataKey="name" />
            <YAxis dataKey="minutes" />
            <Tooltip content={<CustomTooltip />} />
            {/* <Tooltip wrapperStyle={{ width: 100 }} /> */}
            <Legend/>
            <Bar className="barStyle" dataKey="minutes" fill="#00d171" activeBar={<Rectangle fill="#a521ff" stroke="blue" />} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TopTenTracksByYear;