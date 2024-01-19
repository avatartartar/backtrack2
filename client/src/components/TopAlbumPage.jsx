import React from 'react'
import albumImagePlaceholder from '../../assets/album.png';
import { useDispatch, useSelector } from 'react-redux';

const TopAlbumPage = () => {
  const { year } = useSelector(state => state.year)
  const {arrData: topAlbumsByYear, status: statusTopAlbumsByYear, error: errorTopAlbumsByYear} = useSelector(state = state.topAlbumsByYear)
  console.log(topAlbumsByYear)

  return (
    <div className='topAlbumDisplay'>
      <h3>And couldn't get enough of:</h3>
      <div className='albumContainer'>
        <img src={topAlbumsByYear.arrData[0].image_url} alt="image" />
        <>
          <p>{topAlbumsByYear.arrData[0].album_name}</p>
          <p>{topAlbumsByYear.arrData[0].artist_name}</p>
        </>
      </div>
    </div>
  )
};

export default TopAlbumPage;