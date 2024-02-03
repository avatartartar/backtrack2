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
import albumImagePlaceholder from '../../assets/album.png';
import { useSelector } from 'react-redux';
import { selectTopAlbums } from '../features/slice.js';

const TopAlbumPage = () => {
  const { year } = useSelector(state => state.chosen)
  const album = useSelector(selectTopAlbums)[0];
  const {arrData: topAlbumsByYear, status: statusTopAlbumsByYear, error: errorTopAlbumsByYear} = useSelector(state => state.topAlbums);
  // console.log('topAlbums in TopAlbumPage: ', topAlbumsByYear);
  // console.log('album in TopAlbumPage:', album)


  return (
    <div className='topAlbumsDisplay'>
      <h3>And couldn't get enough of this album:</h3>
      <div className='albumContainer'>
      {album &&
        <>
          <img src={album.image_url} alt="image" />
          <h4>{album.artist_name} <br /> {album.album_name}</h4>
        </>
      }
      {!album &&
        <>
          <img src={albumImagePlaceholder} alt="image" />
        </>
      }
      </div>
    </div>
  )
};

export default TopAlbumPage;
