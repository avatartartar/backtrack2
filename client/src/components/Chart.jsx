// import React, { useEffect, useState } from 'react';
// import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area, Tooltip, CartesianGrid } from 'recharts';
// import { fetchTopTenTracksByYear } from '../features/topTenTracksByYearSlice.js';
// import { useDispatch, useSelector } from 'react-redux';
// import '../../styles/index.scss';

// const Chart = () => {
//   const dispatch = useDispatch();
//   const [data, setData] = useState([]);

//   const tracks = useSelector((state) => state.topTenTracksByYear.tracks);

//   useEffect(() => {
//     dispatch(fetchTopTenTracksByYear(2020));
//   }, [dispatch]);

//   useEffect(() => {
//     const top10ByYear = tracks.slice(0, 10);

//     const chartData = top10ByYear.reduce((acc, track) => {
//       const existingData = acc.find((dataPoint) => dataPoint.name === track.month);

//       if (existingData) {
//         existingData[track.track_name] = track.ms_played;
//       } else {
//         const newDataPoint = {
//           [track.track_name]: track.ms_played,
//         };
//         acc.push(newDataPoint);
//       }

//       return acc;
//     }, []);

//     const finalData = [...Array(12)].map((ignoreParam, i) => {
//       const month = i + 1;
//       const existingData = chartData.find((dataPoint) => dataPoint.month)

//       if (existingData) {
//         return existingData;
//       }

//       return { 
//         month,
//         data,
//        }
//     });


//     setData(finalData);
//   }, [tracks]);

//   console.log(data, 'data on line 48')
//   console.log(data[0], 'data[0] on line 49')


//   // const areas = Object.keys(data[0] || {}).map((track, index) => (
//   const areas = data.forEach((el) => (
//     <Area
//       key={el.month}
//       type="monotone"
//       dataKey={el.data.name}
//       stackId="2"
//       stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
//       fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
//       fillOpacity="1"
//     />
//   ));

//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <AreaChart
//         width={500}
//         height={400}
//         data={data}
//         margin={{
//           top: 10,
//           right: 30,
//           left: 0,
//           bottom: 0,
//         }}
//       >
//         <CartesianGrid vertical={false} horizontal={false} />
//         <XAxis dataKey="month" axisLine={false} tickLine={false} />
//         <YAxis axisLine={false} tickLine={false} />
//         <Tooltip />
//         {areas}
//       </AreaChart>
//     </ResponsiveContainer>
//   );
// };

// export default Chart;
