import React, { useEffect, useState, PureComponent } from 'react';
// import { LabelList, BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const MattTest = ({ results }) => {
    // console.log('results from test ->', results);
    const trackNamesArr = results[0].values.map(trackName => trackName[0]);
    const trackArtistArr = results[0].values.map(artistName => artistName[1]);
    const topTrackMinutesArr = results[0].values.map(trackName => trackName[5]);
    const trackAndMinCombined = trackNamesArr.map((track, idx) => {
        return { name: track, value: topTrackMinutesArr[idx] }
    });
    console.log('track and min combined ->', trackAndMinCombined);
    
    //____________________________________________
    const data = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
        { name: 'Group E', value: 600 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042','#FF3977'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
                
            </text>
        );
    };

    return (

        <div>
                <h1>Lame Pie Chart</h1>
                <h3>Min by each top track</h3>
            <div
            style={{
                width:'100vw',
                height:'100vh',
                display:'flex',
                justifyContent:'center',
                alignItems:'center',

            }}
            >
            
      <ResponsiveContainer 
    //   width="100%" height="100%"
      >
        <PieChart width={300} height={300}>
          <Pie
            data={trackAndMinCombined}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={280}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    
            </div>
        </div>



    )
}

export default MattTest