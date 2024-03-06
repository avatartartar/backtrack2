/**
* @file GraphComp.jsx
* @description: Renders a bar chart visualization for the user's top tracks playtime.
  It includes a custom tooltip for displaying track details and calculates the total hours listened.
* @requires react: Utilizes React for component structure, hooks for state management, and lifecycle.
* @requires recharts: For creating the responsive bar chart and custom tooltip.
* @requires react-redux: To dispatch actions and access the Redux store state.
* @requires '../../styles/index.scss': Styles for the graph and tooltip components.
* @imports
* - useSelector, useDispatch from 'react-redux': Hooks for accessing and updating the Redux store.
* - LabelList, BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer from 'recharts': Components and elements for constructing the bar chart.
* @methods
* - CustomTooltip: Renders a tooltip with track details when a bar is hovered.
* @consumers
* - client/src/app/App.jsx
*/

import React, { useEffect, useState, PureComponent } from 'react';
import { LabelList, BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../styles/index.scss'
import { useDispatch, useSelector } from 'react-redux';
import { selectTopTracks } from '../features/slice.js';


const GraphComp = () => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [totalHours, setTotalHours] = useState(null);

  const { year, default : defaultYear, status: statusYear, error: errorYear } = useSelector(state => state.chosen);
  // const { arrData: topTracks, status: statusTopTracks, error: errorTopTracks } = useSelector(state => state.topTracks);
  const topTracks = useSelector(selectTopTracks);
  // setting tracks to either topTracks or topTracksByYear depending on the year selected.
  // then this gets served to the component that renders the tracks.


  useEffect(() => {
    if (topTracks && topTracks.length > 0) {
      const topByYear = topTracks.filter((track, index) =>  index < 10);
      const newData = topByYear.map((track) => ({
        name: track.track_name,
        minutes: track.total_minutes_played,
        album: track.image_url,
        artist_name: track.artist_name,
        album_name: track.album_name,
        hours: (track.total_minutes_played / 60).toFixed(2),
        percent_of_total: ((track.total_minutes_played / 60) / totalHours * 100).toFixed(2),
      }));
      let totalMinutes = 0;
      topByYear.forEach((el) => {
        totalMinutes += el.total_minutes_played;
      })
      const hours = Math.floor(totalMinutes / 60);
      setTotalHours(hours);
      setData(newData);
    }
  }, [year, topTracks])


  function CustomTooltip({ payload, label, active }) {
    if (active) {
      return (
        <div className="custom-tooltip"
        style={{
          margin: '0px 0px 100px 500px',
          background: 'linear-gradient(16deg, rgba(52,13,91, 1) 0%,  rgba(0, 133, 255, 1) 100%)',
          width: '400px',
          heigth: '500px',
          padding: '20px',
          display: 'flex',
          textTransform: 'uppercase',
          fontSize: '24px',
          textAlign: 'right',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
          }}>
          <img src={payload[0].payload.album} alt="" />
          <p style={{ padding: '0px', margin: '5px 0px' }} className="label">{payload[0].payload.artist_name}</p>
          <p style={{ padding: '0px', margin: '5px 0px' }} className="label">"{payload[0].payload.album_name}"</p>
          <br />
          <p style={{ padding: '0px', margin: '0px' }} className="label">Hours listened: {payload[0].payload.hours}</p>
        </div>
      );
    }

    return null;
  }

  const paddingLeft = 15;

  const fontSize = 18;

  return (
       <div className="graphWrapper" style={{ width: '90%', margin: '0 auto' }}>
      <h3>{totalHours} hours<br/> spent listening to the below songs {year === 2024 ? "all-time" :`in ${year}`}</h3>
      <div className="chart">
        <ResponsiveContainer width='90%' height={600}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid stroke="fff" />
            <XAxis stroke="#fff" dataKey="hours" type="number" tick={{ fill: '#efefef'}} />
            <YAxis type="category" tick={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              gap={10}
              barSize={40}
              className="barStyle"
              dataKey="hours"
              fill="#04a8b4"
              // activeBar={{fill: '#000'}}
              activeDot={null}
            >
              <LabelList
                dataKey="name"
                position="top"
                content={(props) => (
                  <text
                    x={props.x + paddingLeft}
                    y={props.y + props.height / 2}
                    fontSize={fontSize} // Font size
                    dy={-fontSize / 2 + 15}
                    fill="#fff" // Color
                    textAnchor="left"
                  >
                    {props.value}
                  </text>
                )}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GraphComp;
