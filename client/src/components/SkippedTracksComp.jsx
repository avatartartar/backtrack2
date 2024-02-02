import React from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

const SkippedTracksComp = ( {results,results2} ) => {

    const tracksSkippedArr = results[0].values;
    const artistSkippedArr = results2[0].values;

    const tracksSkipped = tracksSkippedArr.map(tracks => {
        return (
           <tr style={{color:"black"}}>
            <td>{tracks[0]}</td>
            <td>{tracks[1]}</td>
            <td>{tracks[2]}</td>
            <td>{tracks[3]}</td>
           </tr>
        )
    });

    const artistsSkipped = artistSkippedArr.map(artists =>{
        return (
           <tr style={{color:"black"}}>
            <td>{artists[0]}</td>
            <td>{artists[1]}</td>
           </tr>

        )
    })
    const skippedData = artistSkippedArr.map(artist =>{
        return {
            artist: artist[0],
            "Number of Skips":artist[1],
        }
    });
    console.log('obj of data ->', skippedData);


    return (
        <div>
            <hr></hr>
          <table>
            <thead>
                <tr style={{color:'black'}}>
                    <th>Song</th>
                    <th>Band</th>
                    <th>Album</th>
                    <th>Skipped Count</th>
                </tr>
            </thead>
            <tbody>
        {tracksSkipped}
            </tbody>
          </table>

          <hr></hr>

          {/* <table>
            <thead>
                <tr style={{color:'black'}}>
                    <th>Artists</th>
                    <th>Skip Count</th>
                </tr>
            </thead>
            <tbody>
                {artistsSkipped}
            </tbody>
          </table> */}

          <div style={{width:'100%',height:400, marginBottom:'50px'}}>
        <h2 style={{textAlign:'center'}}>Top 10 Skipped Artists</h2>
          <ResponsiveContainer
        //   width='90%' height={600}
          >
                    <BarChart
                    // layout="vertical"
                        data={skippedData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        >
                            <CartesianGrid stroke="fff" />
                        <XAxis
                            dataKey="artist"
                            stroke="#fff"
                            axisLine={{ stroke: '#FFFFFF' }}
                            tick={{ fill: '#FFFFFF' }}
                            
                            />
                        <YAxis
                        
                            axisLine={{ stroke: '#FFFFFF' }}
                            tick={{ fill: '#FFFFFF' }}
                            />
                        <Tooltip />
                        <Bar dataKey="Number of Skips" fill="#04a8b4" barSize={100}/>
                        {/* <LabelList dataKey="artist" position="top"/> */}
                    </BarChart>
                </ResponsiveContainer>
          </div>
          <br></br>
          {/* <h2>HOW MUCH MORE DATA CAN WE FIT IN THIS SPA?</h2> */}
        </div>
        
    )
}

export default SkippedTracksComp;