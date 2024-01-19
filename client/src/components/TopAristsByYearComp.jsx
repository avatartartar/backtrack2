import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { gsap } from "gsap";

const TopArtistsByYearComp = () => {
  const { year } = useSelector(state => state.year);
  const { arrData: topArtistsByYear, status: statusTopArtistsByYear, error: errorTopArtistsByYear } = useSelector(state => state.topArtistsByYear);
  const { arrData: topArtists, status: statusTopArtists, error: errorTopArtists } = useSelector(state => state.topArtists);

  let artists = year === 0 ? topArtists : topArtistsByYear;
  artists = mapNameAndAddDashes(artists);

  useEffect(() => {
    if (year !== 0) {
      const tl = gsap.timeline({defaults: { ease: 'power3.out' }});
      tl.set('.eachArtist', { x: '100vw' });
      tl.to('.eachArtist', { x: 0, duration: 0.1, stagger: 0.2 });
    }
  }, [artists]);

  return (
    <div className='topArtistsByYearWrapper'>
      <h3>Your favorite artists were</h3>
      <div className='artists'>
        {artists.map((element, i, arr) => <p className='eachArtist'>{element}</p>)}
      </div>
    </div>
  );
}

export default TopArtistsByYearComp;


function mapNameAndAddDashes(array) {
  const copy = JSON.parse(JSON.stringify(array));
  const newArray = [];
  for (let i = 0; i < copy.length; i++) {
    const element = copy[i];
    if (typeof element === 'object') newArray.push(element.name);
    if (i !== copy.length - 1) newArray.push('-');
  }
  return newArray;
}
