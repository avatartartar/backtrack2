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
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { gsap } from "gsap";
import { selectTopArtists } from '../features/slice.js';
import { useData } from './DataContext.jsx';

function mapNameAndAddDashes(array) {
  const copy = JSON.parse(JSON.stringify(array));
  const newArray = [];
  for (let i = 0; i < copy.length; i++) {
    const element = copy[i];
    if (typeof element === 'object') newArray.push(element.artist_name);
    if (i !== copy.length - 1) newArray.push('-');
  }
  return newArray;
}

const TopArtistsComp = () => {
  const { year } = useSelector(state => state.chosen);
  const { reduxReady } = useData();
  const animationTimeline = useRef(gsap.timeline({ paused: true }));
  const mappedArtists = mapNameAndAddDashes(useSelector(selectTopArtists));

  useEffect(() => {
    // resets and prepares elements for animation
    const resetElements = () => {
      gsap.set('.eachArtist', { x: '100vw', opacity: 0});
    };

    // if theres an animation in progress, clear it and start a new one
    const animateArtists = () => {
      if (animationTimeline.current) {
        animationTimeline.current.clear().kill();
      }
      // reset elements before animating
      resetElements();
      animationTimeline.current = gsap.timeline();
      animationTimeline.current.fromTo('.eachArtist',
      // from:
        { x: '100vw', opacity: 0 },
        // x: starting position of the element.
          // vw: vw: unit of measurement relative to the viewport width.
          // '100vw': the element is off the screen to the right.
        // opacity: 0 is the starting opacity of the element.

      // to:
        { x: 0, opacity: 1, duration: 0.2, stagger: 0.2, color: "#FFFFFF" });
        // x: the ending position of the element.
          // 0: relative to the div's position, i think.
        // opacity: the opacity of the element
        // duration: the duration of the animation
        // stagger: the time between each element's animation
        // color: the color of the element (white)
    };

    if (reduxReady && mappedArtists.length > 0) {
      animateArtists();
    }
  }, [reduxReady, mappedArtists]);

  return (
    <div className='artistsWrapper'>
      <h3>You were jammin' to these artists:</h3>
      <div className='artists'>
        {reduxReady && mappedArtists.map((element, index) => (
          <React.Fragment key={index}>
            <p className='eachArtist'>{element}</p>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default TopArtistsComp;
