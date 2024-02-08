// import { getSpotifyToken } from "./getSpotifyToken.js";

const getToken = async () => {
  const response = await fetch('/spotifyToken');
  const token = await response.json();
  return token
};

// retries: The number of retries in case of rate limit hit.
const getTrackRequest = async (uri, retries = 3) => {
  try {
    // Send a GET request to the Spotify API to fetch track information
    const response = await fetch(`https://api.spotify.com/v1/tracks/${uri}?market=US`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + await getToken(),
      },
    });

    if (!response.ok) {

      // 429 is the status code for rate limit hit
      // retries > 0: if we have retries left, we'll wait for the specified time and then retry the request
      if (response.status === 429 && retries > 0) {

        // Retry-After header is given by the Spotify API to indicate the time after which we can retry the request
        // Parses the value of the 'Retry-After' header from the response, converts it to an integer
        const retryAfter = parseInt(response.headers.get('Retry-After'), 10);
        // console.log(`Rate limit hit, retrying after ${retryAfter} seconds.`);

      // Waits for a given time (in seconds) by using a Promise and setTimeout.
      // The resolve function is called after the specified time has passed.
      // The time is calculated by multiplying the value of retryAfter by 1000 to get seconds from ms, and adding 1 second for safety.
        await new Promise(resolve => setTimeout(resolve, (retryAfter + 1) * 1000));
        return getTrackInfo(uri, retries - 1); // Retry the request and decrement the number of retries left, though that number is of our own making. Often 3 apparently.
      }
      // console.log('response.headers', response.headers);
      throw new Error(`Fetch request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`QuerySlice/getTrackInfo: Error fetching data for URI ${uri}:`, error);
    throw error; // Rethrow to handle it in the calling context
  }
};



export { getTrackRequest };
