import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client';
import '../../styles/index.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopTracksByYear, fetchTopArtistsByYear, setYear } from '../features/slice.js';
import gsap from 'gsap';

const YearSliderComp = () => {

  const dispatch = useDispatch();
  const { year, status, error } = useSelector(state => state.chosen);

  function handleSliderInput(e) {
    dispatch(setYear(e.target.value));
    // dispatch(fetchTopTracksByYear({value: e.target.value}));
  }

  function handleClick() {
    gsap.to('.eachArtist', {
      opacity: 0, 
      duration: 0.2,
      onComplete: () => {
        dispatch(fetchTopArtistsByYear({query: year}));
        dispatch(fetchTopTracksByYear({query: year}));
      }
    });

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
        gsap.to("#landingAndSticky", {duration: 2, height: 400})
        gsap.to(".slider", {duration: 2, width: '70%', ease: 'back.in'})
      }
    })

    const headings = document.querySelectorAll(".landing")
    gsap.set(headings, {y: "100%", opacity: 0});

    headings.forEach((heading, index) => {
      tl.to(heading, {y: "0%", opacity: 1, duration: 2}, index * 0.75);
    })
  }, [])



  return (
    <div id="landingAndSticky">
      <h1 className="landing hide">Keith,</h1>
      <h1 className="landing hide">In your Spotify</h1>
      <h1 className="landing hide">Adventure,</h1>
      <h1 className="landing hide">Discover your</h1>
      <div className="landing sliderContainer">
        <h1 className="sliderSubContainer">Your {year ? year : 'all-time'} backtrack</h1>
        <input
          type="range"
          min="2011"
          max="2023"
          defaultValue="2023"
          onMouseUp={handleClick}
          className="slider"
          name='slider'
          onChange={(e) => (handleSliderInput(e))} />
          {/* <br></br> */}
      </div>
    </div>
  )
}
export default YearSliderComp;
