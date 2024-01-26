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
 * - handleSliderInput: Dispatches the setYear action with the value from the slider input.
 * - handleClick: Invokes the fetchData method when the slider value is changed.
 * @consumers
 * - client/src/app/App.jsx
 */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import gsap from 'gsap';


import { setYear, fetchTopTracks, fetchTopArtists, setChosenTrack, fetchTopAlbums } from '../features/slice.js';
import '../../styles/index.scss';

const SliderComp = () => {
  const dispatch = useDispatch();
  const { year, track: chosenTrack, status, error } = useSelector(state => state.chosen);

  const fetchData = () => {
    // the below .then on the dispatch then matching the fulfilled of dispatch to action allows us to wait
    // for the fetchTopTracks to complete before dispatching the chosenTrack.
    // if setChosenTrack is disptached before fetchTopTracks is fulfilled, then chosenTrack will be undefined
    // we want to define it when the page first loads so that there is an image and track name displayed
    // in the right component of TrackComponent.
    dispatch(fetchTopTracks(year)).then((action) => {
      if (fetchTopTracks.fulfilled.match(action) & !chosenTrack.name) {
        dispatch(setChosenTrack(action.payload[0]))
      }
    })

    dispatch(fetchTopAlbums(year));
    gsap.to('.eachArtist', {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        dispatch(fetchTopArtists(year));
      }
    });
  }

  // Dispatch the fetch async thunks when the component mounts
  useEffect(() => {
    if (status === 'idle') {
      fetchData()
    }
  }, [dispatch, status]);

  function handleSliderInput(e) {
    dispatch(setYear(e.target.value));
  }

  function handleClick() {
    fetchData()
  }

  // functionality for slider animation on load: All of this text/animation will disappear except
  // for slider and header for slider after animation completes.
  useEffect(() => {
    // commenting out portions are to make testing easier during development
    const tl = gsap.timeline({
      defaults: {ease: "power1.out"},
      onComplete: () => {
        // gsap.to(".hide", {duration: 2, opacity: 0, y: -600, stagger: 0.05})
        // gsap.from(".sliderContainer", {duration: 2, y: 0, stagger: 0.05}, "+5")
        // the movement of the slider container
        // gsap.to(".sliderContainer", {duration: 2, y: -400})
        gsap.to("#landingAndSticky", {
          duration: 2, height: 150, padding: '30px', marginTop: '0px'})
          // the background color behind the "Your ... Backtrack" and the slider
        gsap.to('#landingAndSticky', { duration: 0, background: '#07004e' }, )
        // the slider
        gsap.to(".slider", {duration: 2, width: '70%', opacity: 1, ease: 'power3.out'})
      }
    })


    // const headings = document.querySelectorAll(".landing")
    // gsap.set(headings, {y: "100%", opacity: 0});
    gsap.set(".slider", {opacity: 0})
    gsap.set('.currentYear', {duration: 0.02, ease: 'in'})

    // headings.forEach((heading, index) => {
    //   tl.to(heading, {y: "0%", opacity: 1, duration: 2}, index * 0.75);
    // })
  }, [])

  return (
    <div id="landingAndSticky">
      {/* hiding the below name now, as a quick attempt to delete it messed up the spacing of the slider container*/}
      {/* <h1 className="landing hide" style={{visibility: 'hidden'}}>Keith,</h1>
      {/* hiding to make testing easier}
      <h1 className="landing hide" style={{visibility: 'hidden'}}>In your Spotify</h1>
      <h1 className="landing hide" style={{visibility: 'hidden'}}>Adventure,</h1>
      <h1 className="landing hide" style={{visibility: 'hidden'}}>Discover...</h1> */}
      <div className="landing sliderContainer">
        {/* the ternary operator below allows us to use the 2024 value in the slider while displaying the text 'all-time' */}
        <h1 className="sliderSubContainer">Your { year != 2024 ? year : 'all-time' } backtrack</h1>
        <input
          type="range"
          min="2011"
          max="2024"
          defaultValue="2024"
          onMouseUp={handleClick}
          className="slider"
          name='slider'
          onChange={(e) => (handleSliderInput(e))} />
          {/* <br></br> */}
      </div>
    </div>
  )
}
export default SliderComp;
