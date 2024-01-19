import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const TopArtistsByYearComp = () => {
  const { year } = useSelector(state => state.year);
  const { arrData: topArtistsByYear, status: statusTopArtistsByYear, error: errorTopArtistsByYear } = useSelector(state => state.topArtistsByYear);
  const { arrData: topArtists, status: statusTopArtists, error: errorTopArtists } = useSelector(state => state.topArtists);

  let artists;
  let status;
  if (year === 0) {
    artists = topArtists;
    status = statusTopArtists;
  } else {
    artists = topArtistsByYear;
    status = statusTopArtistsByYear;
  }

  const mappedArtists = mapNameAndAddDashes(artists);

  useGSAP(() => {
    const tl = gsap.timeline({defaults: { ease: 'power3.out', delay: 0.2 }});
    tl.from('.eachArtist', { x: '100vw', duration: 0.1, stagger: 0.2 });
  }, [status]);


  return (
    <div className='topArtistsByYearWrapper'>
      <h3>Your favorite artists were</h3>
      <div className='artists'>
        {status === 'succeeded' && mappedArtists.map((element) => <p className='eachArtist'>{element}</p>)}
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
