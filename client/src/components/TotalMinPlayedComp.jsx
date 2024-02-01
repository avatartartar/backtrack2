import React, { useEffect, useState } from 'react';

const TotalMinPlayedComp = ({ results }) => {
    if (results && results.length > 0 && results[0].values && results[0].values.length > 0) {
        return (
            <div className='topAlbumsDisplay' style={{width: '100%'}}>
                <h3>
                    <div>Your total time spent listening is {results[0].values[0][0]} days...</div>
                    <div>or {results[0].values[0][1]} hours... </div>
                    <div> or {results[0].values[0][2]} minutes</div>
                </h3>
            </div>
        )
    }
}

export default TotalMinPlayedComp;
