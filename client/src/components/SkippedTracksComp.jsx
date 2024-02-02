import React from 'react'

const SkippedTracksComp = ({ results }) => {

    // console.log('from skippedTracks -> ', results[0].values);
    const skipped = results[0].values;
    // results[0].values.forEach(track => console.log(track));
    const skippedTracks = skipped.map(tracks => {
        return (
           <tr style={{color:"black"}}>
            <td>{tracks[0]}</td>
            <td>{tracks[1]}</td>
            <td>{tracks[2]}</td>
           </tr>


        )
    })
    return (
        <div>Skipped Tracks/Artists component all time
            {/* {skippedTracks} */}
          <table>
            <thead>
                <tr style={{color:'black'}}>
                    <th>Song</th>
                    <th>Band</th>
                    <th>Album</th>
                </tr>
            </thead>
            <tbody>
        {skippedTracks}
            </tbody>
          </table>
          <h2> conver to bar chart, get skips count, another option/table for skipped artists </h2>
        </div>
    )
}

export default SkippedTracksComp;
