/**
 * @file App.jsx
 * @description This file defines the main React component that serves as the entry point for the application's interface.
 * It assembles various components to form the overall layout.
 * It gets called by the index.jsx file in the same directory.
 *
 * @requires 'react': React library is required for component definition.
 * @requires '../components/GraphComp.jsx': The component for displaying the graph that currently 2024-01-23 renders at the bottom of the page.
 * @requires '../components/LogStateComp.jsx': The component for rendering the store to the console with the click of cmd+Enter anywhere on the site.
 * @requires '../components/NavbarComp.jsx': The component for the navigation bar, which as of 2024-01-23 is just the Backtrack logo.
 * @requires '../components/TopArtistsComp.jsx': The component for displaying top artists.
 * @requires '../components/TopAlbumComp.jsx': The component for displaying top albums.
 * @requires '../components/TopTracksComp.jsx': The component for displaying top tracks.
 * @requires '../components/SliderComp.jsx': The component for year range selection and landing page.
 * @requires '../../styles/index.scss': The main stylesheet for the application.
 *
 * @methods
 * - App: The main functional component that renders the application layout by combining all the individual components.
 */
import React from 'react'

import GraphComp from '../components/GraphComp.jsx';
import LogStateComp from '../components/LogStateComp.jsx';
import NavbarComp from '../components/NavbarComp.jsx';
import TopArtistsComp from '../components/TopArtistsComp.jsx';
import TopAlbumComp from '../components/TopAlbumComp.jsx';
import TopTracksComp from '../components/TopTracksComp.jsx';
import YearSliderComp from '../components/SliderComp.jsx';
// import SqlLoadComp from '../components/SqlLoadComp.jsx';
import SqlParentComp from '../components/SqlParentComp.jsx';

import '../../styles/index.scss';

export function App() {

  return (
    <>
      <LogStateComp/>
      <NavbarComp/>
      <YearSliderComp/>
      <TopTracksComp/>
      <TopArtistsComp/>
      <TopAlbumComp/>
      <GraphComp/>
      <SqlParentComp/>
    </>
  )
}

// This exports the entire file "App" or module.
export default App;
