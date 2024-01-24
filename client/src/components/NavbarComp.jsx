/**
* @file NavbarComp.jsx
* @description: This component renders the navigation bar for the application, which atm 2024-01-23 is only the application's logo.
* @requires react: Utilizes React for component structure.
* @imports
* - '../../assets/logo.png': The logo image displayed in the navigation bar.
* @methods None
* @consumers
* - client/src/app/App.jsx
*/
import React from 'react';
import logo from '../../assets/logo.png';
import ImportComp from './ImportComp.jsx';

const NavbarComp = () => {
  return (
    <div className="navBar">
      <img src={logo}/>
      <ImportComp/>
    </div>
  )
}

export default NavbarComp;
