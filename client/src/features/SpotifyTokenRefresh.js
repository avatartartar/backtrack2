
// we setup the variables for the token and the expiration time, which we will be reassigning
let token = null
let tokenExpiration = null ;

// Keith/spotifyTokenIntegration: 2024-01-13
// refreshToken: this gets called when the token is expired or null.
// this is not the preferred method of refreshing the token according to Spotify docs.
// there is a refresh token request, but I couldn’t find the 'refresh token' needed
// to make it work. This works ¯\_(ツ)_/¯

const refreshSpotifyToken = async () => {
  // must set the below variables to the values we get from our spotify app's dashboard
  console.log('refreshSpotifyToken called');
  const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID || 'default_client_id';
  const client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET || 'default_client_secret';
  client_id === 'default_client_id' ? console.log('ERROR. Client_id not pulled from env') : console.log('client_id', client_id);;
  client_secret === 'default_client_secret' ? console.log('ERROR. Client_secret not pulled from env') : null;

  // has to be in base64
  // buffer is a node module not neccessarily available in the browser
  // const credentials = Buffer.from(client_id + ':' + client_secret).toString('base64');
  // so instead we use btoa, which is a browser method
  const credentials = btoa(client_id + ':' + client_secret);
  try {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    },
  });
  const data = await response.json();
  // returning the object from spotify to 'getSpotifyToken'
  // it has the following properties: access_token, token_type, expires_in
  return data;
} catch (error) {
  console.log('refreshSpotifyToken: 4: error', error);
  return error;
}


};

const getSpotifyToken = async () =>{
  const now = Date.now();
  // if the token is not null and the expiration time is greater than now
  if (!token && tokenExpiration < now) {
    // The token is not valid, refresh it.
    const newToken = await refreshSpotifyToken();

    // setting the token var to the new token
    token = newToken.access_token;

    // Set the expiration time a little bit earlier than the actual expiration time,
    // to account for possible delays or clock differences.

    tokenExpiration = now + newToken.expires_in * 1000 - 30000;

    // tokenExpiration in minutes for easy viewing
    const tokenExpirationMinutes = Math.floor((tokenExpiration - now) / 60000);
    console.log('tokenExpirationMinutes', tokenExpirationMinutes);

  }
  // The token is still valid
  // Return it from the cache
  return token;
}

export { getSpotifyToken };
