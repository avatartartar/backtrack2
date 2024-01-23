/**
 * @file TopArtistsComp.jsx
 * @description: Displays a list of top artists for a given year, animating their appearance using GSAP.
 * @requires react: For building the component using React hooks.
 * @requires react-redux: To access the Redux state within the component.
 * @requires gsap: For the animation of the artist elements.
 * @requires @gsap/react: To use GSAP with React functional components.
 * @imports
 * - useSelector: To retrieve state data from the Redux store.
 * - gsap: For creating timeline animations.
 * - useGSAP: A custom hook to integrate GSAP animations with React.
 * @methods
 * - mapNameAndAddDashes: Takes an array of artist objects and returns a new array with artist names and dashes that then get rendered sequentially.
 * @consumers
 * - client/src/app/App.jsx
 */
import React from 'react';
import { useSelector } from 'react-redux';

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
      <h3>You were jammin' to these artists:</h3>
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
