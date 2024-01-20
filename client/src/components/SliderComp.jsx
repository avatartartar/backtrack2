import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client';
import '../../styles/index.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setYear, fetchTopTracks, fetchTopArtists, setChosenTrack } from '../features/slice.js';
import gsap from 'gsap';

const SliderComp = () => {

  const dispatch = useDispatch();

  const { year, track: chosenTrack, status, error } = useSelector(state => state.chosen);


  const fetchData = () => {
    // the below .then on the dispatch then matching the fulfilled of dispatch to action allows us to wait for the fetchTopTracks to complete before dispatching the chosenTrack.
    // trying to set the chosen track when the page first loads was resulting in an error, as TopTracks hadn't yet returned its promise.
    dispatch(fetchTopTracks(year)).then((action) => {
      if (fetchTopTracks.fulfilled.match(action) & !chosenTrack.name) {
        dispatch(setChosenTrack(action.payload[0]))
      }
    })
    dispatch(fetchTopArtists(year)).then((action) => {
      if (fetchTopArtists.fulfilled.match(action)) {
    gsap.to('.eachArtist', {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        dispatch(fetchTopArtists(year));
      }
    });
      }
    })
  // dispatch(fetchTopAlbums(year))
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


    // dispatch other 'TopByYear' actions here
  }

  // functionality for animation on load: All will disappear except
  // for slider and header for slider after landing page is completed
  useEffect(() => {
    const tl = gsap.timeline({
      defaults: {ease: "power1.out"},
      onComplete: () => {
        gsap.to(".hide", {duration: 2, opacity: 0, y: -600, stagger: 0.05})
        gsap.from(".sliderContainer", {duration: 2, y: 0, stagger: 0.05}, "+5")
        gsap.to(".sliderContainer", {duration: 2, y: -400})
        gsap.to("#landingAndSticky", {
          duration: 2, height: 130, background: '#060430', padding: '30px', marginTop: '0px'})
        gsap.to(".slider", {duration: 2, width: '70%', opacity: 1, ease: 'power3.out'})
      }
    })

    const headings = document.querySelectorAll(".landing")
    gsap.set(headings, {y: "100%", opacity: 0});
    gsap.set(".slider", {opacity: 0})
    gsap.set('.currentYear', {duration: 0.02, ease: 'in'})

    headings.forEach((heading, index) => {
      tl.to(heading, {y: "0%", opacity: 1, duration: 2}, index * 0.75);
    })
  }, [])

  return (
    <div id="landingAndSticky">
      <h1 className="landing hide">Keith,</h1>
      <h1 className="landing hide">In your Spotify</h1>
      <h1 className="landing hide">Adventure,</h1>
      <h1 className="landing hide">Discover...</h1>
      <div className="landing sliderContainer">
        {/* the terniary operator below allows us to use the 2024 year in the slider while displaying 'all-time'  */}
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
