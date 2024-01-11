import React from 'react';
import album from '../../assets/album.png';

const TopAlbum = () => {
  return (
    <div className="topAlbum">
      <h3>MOST PLAYED ALBUM</h3>
      <div className="albumCard">
        <img src={album} alt="image" />
        <h4>RUFUS DU SOL <br /> IN BLOOM</h4>
      </div>
    </div>
  )
}

export default TopAlbum;

