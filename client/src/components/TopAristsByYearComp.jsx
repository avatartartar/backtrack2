import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const TopArtistsByYearComp = () => {
  const { year } = useSelector(state => state.year);
  const { arrData: topArtistsByYear, status: statusTopArtistsByYear, error: errorTopArtistsByYear } = useSelector(state => state.topArtistsByYear);
  const { arrData: topArtists, status: statusTopArtists, error: errorTopArtists } = useSelector(state => state.topArtists);

  const artists = year === 0 ? topArtists : topArtistsByYear;
  console.log('artists:', artists)

  return (
    <div className='topArtistsByYearWrapper'>
      <h3>Your favorite artists were</h3>
      <div className='artists'>{artists.map((artist, i, arr) => {
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
