import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useData } from './DataContext.jsx';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

const SkippedTracksComp = ({ results, results2 }) => {
    const { sqlDb } = useData();
    const { tracks, albums, artists, minutes } = useSelector(state => state.query);

    const [skippedTracks, setSkippedTracks] = useState('');
    const [skippedArtists, setSkippedArtists] = useState('');
    
    // console.log('tracks skipped Arr after state declaration ->',skippedTracks);
    const getSkipData = () => {
        const res = sqlDb.exec(tracks.skippedTracks);
        const res2 = sqlDb.exec(artists.skipped);
        setSkippedTracks(res[0].values);
        setSkippedArtists(res2[0].values);

        //this gives single arr w 2 elements of artist and # skips
        console.log('skippedArtists ->', skippedArtists[0]);
    }
    useEffect(() => {
        if (sqlDb) {
            //execute skipped tracks func that will call db and set set state according to data
            getSkipData();
        }
    }, [sqlDb]);

    if (!skippedTracks.length || !skippedArtists.length) {
        return <div>Hold on a bit </div>
    };

    // const tracksSkipped = skippedTracks.map(tracks => {
    //     return (
    //         <tr style={{ color: "black" }}>
    //             <td>{tracks[0]}</td>
    //             <td>{tracks[1]}</td>
    //             <td>{tracks[2]}</td>
    //             <td>{tracks[3]}</td>
    //         </tr>
    //     )
    // });


    //THIS IS DATA NEEDED FOR GRAPH 
    const skippedData = skippedArtists.map(artist => {
        return {
            artist: artist[0],
            "Number of Skips": artist[1],
            
        }
    });
    
    const renderCustomizedLabel = (props) => {
        const { x, y, width, height, value } = props;

        return (
            <text x={x + width / 2} y={y + height / 2} fill="#FFFFFF" textAnchor="middle" dominantBaseline="central">
                {value}
            </text>
        );
    };


    return (

        <div>
            {/* <table>
                <thead>
                    <tr style={{ color: 'black' }}>
                        <th>Song</th>
                        <th>Band</th>
                        <th>Album</th>
                        <th>Skipped Count</th>
                    </tr>
                </thead>
                <tbody>
                    {tracksSkipped}
                </tbody>
            </table> */}


            <h2 style={{ textAlign: 'center' }}>Top 10 Skipped Artists All-Time</h2>
            <div style={{ width: '90%', height: 600, margin: 'auto' }}>
                <ResponsiveContainer >
                    <BarChart
                        layout="vertical"
                        data={skippedData}
                        margin={{
                            top: 5,
                            right: 0,
                            left: 0,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid stroke="fff" />
                        <XAxis
                            type="number"
                            stroke="#fff"
                            axisLine={{ stroke: '#FFFFFF' }}
                            tick={{ fill: '#FFFFFF' }}
                            // fontSize={5}
                        
                        />
                        <YAxis
                            dataKey="artist"
                            type="category"
                            width={80}
                            axisLine={{ stroke: '#FFFFFF' }}
                            tick={{ fill: '#FFFFFF' }}
                            // hide
                        />

                        <Tooltip />

                        <Bar dataKey="Number of Skips" fill="#04a8b4" />
                        <LabelList dataKey="artist" content={renderCustomizedLabel} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

    )
}

export default SkippedTracksComp;
{/* <h2>HOW MUCH MORE DATA CAN WE FIT IN THIS SPA?</h2> */ }
{/* the limit does not exist */ }

