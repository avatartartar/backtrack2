import React, { useEffect, useState, PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { fetchTopTracksByYear } from '../features/slice.js';
import { useDispatch, useSelector } from 'react-redux';


//sample data for graph
const data = [
  {
    name: '2011',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: '2012',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: '2013',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: '2014',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: '2015',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: '2016',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: '2017',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: '2017',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: '2018',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: '2019',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: '2020',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: '2021',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: '2022',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: '2023',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];


const GraphComp = () => {
  // const [year, setYear] = useState(2000);

  const dispatch = useDispatch();
//   const { arrData: topTracksByYear, status } = useSelector(state => state.topTracksByYear);


// // sample year for getting year
//   const yearsArray = ['2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024']


  // function handleSliderInput(e) {
  //   // setYear(e.target.value);
  //   dispatch(fetchTopTracksByYear({value: e.target.value}));
  // }

  // function handleClick() {
  //   dispatch(fetchTopTracksByYear({value: year}));
  // }

  return (
    <div className="topTracksByYearWrapper">
    {/* <div className="slideContainer">
        <h1>The Year is</h1><h1 className="topTracksByYearYear">{year}</h1>
      <input type="range" min="2000" max="2024" className="slider" name='slider' onChange={(e) => handleSliderInput(e)}/>
      <button className='sliderButton' onClick={handleClick}><b>{year}</b></button>
    </div> */}
    {/* {tracks.map(track => {return <div>{track.name}</div>})} */}
      <div className="chart">
        <ResponsiveContainer width="90%" height="50%">
          <LineChart
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
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GraphComp;
