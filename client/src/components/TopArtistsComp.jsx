import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

const TopArtistsComp = () => {
  const { year } = useSelector(state => state.chosen);
  const { arrData: topArtists, status: statusTopArtists, error: errorTopArtists } = useSelector(state => state.topArtists);

  return (
    <div className='topArtistsWrapper'>
      <h3>You jammed to</h3>
      <div className='topArtists'>{topArtists.map((artist, i, arr) => {
        if (i === arr.length - 1) return <p key={artist.name}>{artist.name}</p>;
        return (
          // React.Fragment is a wrapper to group multiple elements without adding an extra DOM element
          <React.Fragment key={artist.name}>
            <p>{artist.name}</p>
            <p>-</p>
          </React.Fragment>
        )
        })}</div>
    </div>
  );
}

export default TopArtistsComp;
