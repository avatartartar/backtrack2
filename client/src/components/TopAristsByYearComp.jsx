import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

const TopArtistsByYearComp = () => {
  const { year } = useSelector(state => state.year);
  console.log('year in TopArtistsByYearComp:', year)
  const { arrData: topArtistsByYear, status: statusTopArtistsByYear, error: errorTopArtistsByYear } = useSelector(state => state.topArtistsByYear);
  console.log('errorTopArtistsByYear in TopArtistsByYearComp:', errorTopArtistsByYear)
  console.log('statusTopArtistsByYear in TopArtistsByYearComp:', statusTopArtistsByYear)
  console.log('topArtistsByYear in TopArtistsByYearComp:', topArtistsByYear)

  return (
    <div>
 
    </div>
  );
}

export default TopArtistsByYearComp;