/**
 * @file SliderComp.jsx
 * @description: Provides an interactive slider for users to select a year and fetches the top tracks, artists, and albums from Spotify for that year.
 *  It also handles the initial animation sequence when the component mounts.
 * @requires react: For building the component using React hooks and lifecycle.
 * @requires gsap: For creating and controlling animations.
 * @requires react-redux: To dispatch actions and select state from the Redux store.
 * @imports
 * - '../../styles/index.scss': Styles for the component.
 * - '../features/slice.js': Redux slice that contains actions and reducers for fetching and setting data related to Spotify's top tracks, artists, and albums.
 * @methods
 * - fetchData: Dispatches actions to fetch top tracks, artists, and albums, and handles the initial chosen track state.
 * - handleSliderInput: Dispatches the setChosenYear action with the value from the slider input.
 * - handleClick: Invokes the fetchData method when the slider value is changed.
 * @consumers
 * - client/src/app/App.jsx
 */

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import gsap from 'gsap';

import { useData } from './DataContext.jsx';


import {
  setChosenYear,
  setFirstYear,
  setUserFirsts,
  fetchTopArtists,
  setChosenTrack,
  setResults
 } from '../features/slice.js';

import '../../styles/index.scss';

// this is to prevent the page from scrolling to the bottom when the slider is moved

const SliderComp = () => {
  const dispatch = useDispatch();

  const { sqlDb, reduxReady } = useData();
  const { year: firstYear } = useSelector(state => state.user.first);
  const { tracks: tracksQueries } = useSelector(state => state.query);
  const firstTrackQuery = tracksQueries.first;
  // console.log('firstYear', firstYear);
  const [yearHover, setYearHover] = useState(2024);

  // Scroll to the top of the page when the component mounts
  // window.history.scrollRestoration = 'manual';
  useEffect(() => {
    // Delay the scroll to the top of the page on component mount
    const delay = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);

    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    // Scroll to the top of the page on component mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  function handleSliderInput(e) {
    setYearHover(e.target.value);
  }

  function handleClick() {
    dispatch(setChosenYear(yearHover));
  }

  useEffect(() => {
    if (firstYear) {
      console.log('First Year after dispatching, in useEffect:', firstYear);
      // fetchData()
      // Perform actions that depend on firstYear being set
    }
  }, [firstYear]); // Listen for changes to firstYear

  const getFirstYear = async () => {
    const firstYearRes = await sqlDb.exec(firstTrackQuery)[0].values[0][0].substring(0, 4);
    try {
      console.log('firstYear before dispatching', firstYear);
        // dispatch(setUserFirsts({ year: firstYearRes }));
        dispatch(setFirstYear(firstYearRes));

    }
    catch (error) {
      console.error('Error dispatching first year:', error);
    }
  }
  // functionality for slider animation on load: All of this text/animation will disappear except
  // for slider and header for slider after animation completes.
  useEffect(() => {
    // ony runs once our redux store is filled with the sql/dexie data
    if (!reduxReady) return;
    getFirstYear();
    // commenting out portions are to make testing easier during development
    const tl = gsap.timeline({
      defaults: {ease: "power1.out"},
      onComplete: () => {

        gsap.to("#landingAndSticky", {
          duration: 2, height: 150, padding: '30px', marginTop: '0px'})
          // the background color behind the "Your ... Backtrack" and the slider
        gsap.to('#landingAndSticky', { duration: 0, background: '#07004e' }, )
        // the slider
        gsap.to(".slider", {duration: 2, width: '70%', opacity: 1, ease: 'power3.out'})
      }
    })

    gsap.set(".slider", {opacity: 0})
    gsap.set('.currentYear', {duration: 0.02, ease: 'in'})


  }, [reduxReady])

  return (
    <div id="landingAndSticky">
      <div className="landing sliderContainer">
        {/* the ternary operator below allows us to use the 2024 value in the slider while displaying the text 'all-time' */}
        <h1 className="sliderSubContainer">Your { yearHover != 2024 ? yearHover : 'All-Time' } Back Track</h1>
        {firstYear && (
  <input
    type="range"
    min={firstYear}
    max="2024"
    defaultValue="2024"
    onMouseUp={handleClick}
    className="slider"
    name='slider'
    onChange={handleSliderInput}
  />
)}
          {/* <br></br> */}
      </div>
    </div>
  )
}
export default SliderComp;
