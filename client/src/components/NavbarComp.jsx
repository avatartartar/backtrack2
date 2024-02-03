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
import {useData} from './DataContext.jsx';



const NavbarComp = () => {

  const { sqlDb } = useData();

  const downloadSqlDb = () => {
    const sqlDbBinary = sqlDb.export();
    // octet-stream means binary file type
    const sqlData = new Blob([sqlDbBinary], { type: 'application/octet-stream' });
    // asks the user where to save the file
    saveAs(sqlData, 'my_spotify_history_database.sql');
  };

  return (
    <div>
      <div className="navBar">
        <img src={logo}/>
        {sqlDb && (
          <button
            style={{
              position: 'absolute',
              right: '0',
              width: '150px',
              height: '50px',
              cursor: 'pointer',
              marginTop: '25px',
              border: '1px solid white',
              // padding: '30px',
              backgroundColor: 'transparent',
              color: 'white',
            }}
            onClick={downloadSqlDb}
          >
            Download your
            <br />
            SQL-ized data
          </button>
        )}
      </div>
    </div>
  )
}

export default NavbarComp;
