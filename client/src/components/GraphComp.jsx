import React, { useEffect, useState, PureComponent } from 'react';
import backtrack from '../../assets/logo.png'
import { LabelList, BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../styles/index.scss'
// import { fetchTopTracksByYear } from '../features/slice.js';
import { useDispatch, useSelector } from 'react-redux';


const GraphComp = () => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [totalTime, setTotalTime] = useState(null);

  const { year, default : defaultYear, status: statusYear, error: errorYear } = useSelector(state => state.chosen);
  const { arrData: topTracks, status: statusTopTracks, error: errorTopTracks } = useSelector(state => state.topTracks);

  // setting tracks to either topTracks or topTracksByYear depending on the year selected.
  // then this gets served to the component that renders the tracks.


  useEffect(() => {
    if (topTracks && topTracks.length > 0) {
      const topByYear = topTracks.filter((track, index) =>  index < 10);
      const newData = topByYear.map((track) => ({
        name: track.name,
        minutes: track.playtime_minutes,
        album: track.image_url,
      }));
      let totalMinutes = 0;
      topByYear.forEach((el) => {
        totalMinutes += el.playtime_minutes;
      })
      const hours = Math.floor(totalMinutes / 60);
      setTotalTime(hours);
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
          width: '300px', 
          heigth: '400px', 
          padding: '20px', 
          display: 'flex', 
          textTransform: 'uppercase',
          fontSize: '24px',
          textAlign: 'start',
          flexDirection: 'column', 
          justifyContent: 'flex-start', 
          alignItems: 'flex-start',
          }}>
          <img src={payload[0].payload.album} alt="" />
          <p style={{padding: '0px',  margin: '20px 0px'}} className="label">{payload[0].payload.name}</p>
          <p style={{ padding: '0px', margin: '5px 0px' }} className="label">{payload[0].payload.artist_name}</p>
          <p style={{ padding: '0px', margin: '0px' }} className="label">Minutes listened:</p>
          <p style={{ padding: '0px', margin: '0px' }} className="desc">{payload[0].payload.minutes}</p>
        </div>
      );
    }

    return null;
  }

  const paddingLeft = 15;
  const fontSize = 18;

  return (
    <div className="graphWrapper">
      <h3>You listened to {totalTime} hours<br/> of your favorite songs</h3>
      <div className="chart">
        <ResponsiveContainer width={1200} height={600}>
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
            <XAxis stroke="#fff" dataKey="minutes" type="number" tick={{ fill: '#efefef'}} />
            <YAxis type="category" tick={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              gap={10} 
              barSize={40} 
              className="barStyle" 
              dataKey="minutes" 
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
