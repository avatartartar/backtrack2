/**
* @file TopAlbumComp.jsx
* @description: Renders the top album of a selected year and displays its image, artist, and name.
*   It fetches the ranked album data from the Redux store's state and selects the first album with an available image.
*   That's a temporary solution until we ensure every album has an image_url.
* @requires react: To utilize React components, hooks, and state management.
* @requires react-redux: To access Redux store state within the component.
* @imports
* - '../../assets/album.png': Placeholder image for albums without an available image.
* @methods
* - getFirstAlbumWithImage: A function that iterates through the ranked album data to find the first album with an image URL.
* @consumers
* - client/src/app/App.jsx
*/
import React, { useEffect, useState } from 'react'
// import albumImagePlaceholder from '../../assets/album.png';
import { useSelector } from 'react-redux';
import { selectTopAlbums } from '../features/slice.js';
import { useData } from './DataContext.jsx';

const TopAlbumComp = () => {
  const { reduxReady } = useData();
  const { year } = useSelector(state => state.chosen)
  const album = useSelector(selectTopAlbums)[0];
  // console.log('album in TopAlbumComp:', album)
  useEffect(() => {
    if (reduxReady && album) {
      console.log('redux is ready in album', new Date().toLocaleTimeString());
      console.log('album in TopAlbumComp:', album)
    }
    else {
      console.log('redux is not ready in album', new Date().toLocaleTimeString())
    }
  }, [album, reduxReady])



  return (
    <div className='topAlbumsDisplay'>
      <h3>And couldn't get enough of this album:</h3>
      <div className='albumContainer'>
      {album && reduxReady &&
        <>
          <img src={album.image_url} alt="image" />
          <h4>{album.artist_name} <br /> {album.album_name}</h4>
        </>
      }
      </div>
    </div>
  )
};

export default TopAlbumComp;
