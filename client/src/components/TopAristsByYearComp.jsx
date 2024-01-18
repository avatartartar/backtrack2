import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

const TopArtistsByYearComp = () => {
  const { year } = useSelector(state => state.year);
  const { arrData: topArtistsByYear, status: statusTopArtistsByYear, error: errorTopArtistsByYear } = useSelector(state => state.topArtistsByYear);

  return (
    <div className='topArtistsByYearWrapper'>
      <h3>Your favorite artists were</h3>
      <div className='topArtistsByYear'>{topArtistsByYear.map((artist, i, arr) => {
        if (i === arr.length - 1) return <p>{artist.name}</p>;
        return (
          <>
            <p>{artist.name}</p>
            <p>-</p>
          </>
        )
      })}</div>
    </div>
  );
}

export default TopArtistsByYearComp;
