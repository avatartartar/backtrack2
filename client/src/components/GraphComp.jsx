import React, { useEffect, useState, PureComponent } from 'react';

import { AreaChart, Area, BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// import { fetchTopTracksByYear } from '../features/slice.js';
import { useDispatch, useSelector } from 'react-redux';


const GraphComp = () => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  const { year, default : defaultYear, status: statusYear, error: errorYear } = useSelector(state => state.year);
  const { arrData: topTracks, status: statusTopTracks, error: errorTopTracks } = useSelector(state => state.topTracks);
  const { arrData: topTracksByYear, status: statusTopTracksByYear, error: errorTopTracksByYear } = useSelector(state => state.topTracksByYear);

  // setting tracks to either topTracks or topTracksByYear depending on the year selected.
  // then this gets served to the component that renders the tracks.
  const tracks = year === 0 ? topTracks : topTracksByYear;

  useEffect(() => {
    if (tracks && tracks.length > 0) {
      const topByYear = tracks.filter((track, index) =>  index < 10);
      console.log('useEffect in GraphComp.jsx invoked');
      const newData = topByYear.map((track) => ({
        name: track.name,
        minutes: track.playtime_minutes,
      }));

      setData(newData);
    }
  }, [year, tracks])


  function CustomTooltip({ payload, label, active }) {
    if (active) {
      return (
        <div className="custom-tooltip" style={{background: 'green', width: '200px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
          <p className="label">{payload[0].payload.name}</p>
          <p className="desc">{payload[0].payload.minutes}</p>
        </div>
      );
    }

    return null;
  }
  return (
    <div className="topTracksByYearWrapper">
      <div className="chart">
        <ResponsiveContainer width="100%" height="40%">
          <BarChart
            layout="vertical"
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 50,
              left: 50,
              bottom: 5,
            }}
          >

            <CartesianGrid strokeDasharray="0 0" />
            <XAxis dataKey="minutes" type="number" />
            <YAxis dataKey="name"  type="category" width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Legend/>
            <Bar className="barStyle" dataKey="minutes" fill="#3a86ff" activeBar={<Rectangle fill="#fb5607" />}>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GraphComp;
