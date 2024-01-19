import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

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

const TopArtistsComp = () => {
  const { year } = useSelector(state => state.chosen);
  const { arrData: topArtists, status, error } = useSelector(state => state.topArtists);

  const mappedArtists = mapNameAndAddDashes(topArtists);

  useGSAP(() => {
    const tl = gsap.timeline({defaults: { ease: 'power3.out', delay: 0.2 }});
    tl.from('.eachArtist', { x: '100vw', duration: 0.1, stagger: 0.2 });
  }, [status]);


  return (
    <div className='artistsWrapper'>
      <h3>Your favorite artists were</h3>
      <div className='artists'>
        {status === 'succeeded' && mappedArtists.map((element, index) => (
          <React.Fragment key={index}>
            <p className='eachArtist'>{element}</p>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default TopArtistsComp;
