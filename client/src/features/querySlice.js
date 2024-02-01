import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSpotifyToken } from "./SpotifyTokenRefresh.js";

export const makeClientTables = createAsyncThunk(
  'query/makeClientTables',
  // we pass in dbArg, which is the database object holding our entire sqlDb.
  // and getState, which is a function in the the thunkAPI that returns the current state of the Redux store.
  // We can't use useSelector here because that’s only available in React components.
  // by destructuring the getState argument, we can access the current state of the Redux store without having to pass thunkAPI in as an argument
  // followed by doing const getState = thunkAPI.getState;

  async (dbArg, { getState }) => {
    const { tracks, albums, artists } = getState().query;
    const typeMap = { tracks, albums, artists };
    const typeOptions = ['tracks', 'albums', 'artists'];

    // Use Promise.all with map instead of forEach
    await Promise.all(typeOptions.map(async (typeOption) => {
      const typeObject = typeMap[typeOption];

      try {
        const allTimeQuery = `CREATE TABLE top_${typeOption}_allTime AS ${typeObject.allTime}`;
        await dbArg.run(allTimeQuery);
        console.log(`Created table "top_${typeOption}_allTime".`);

      } catch (error) {
        console.error(`Error creating allTimetable "${typeOption}_allTime":`, error.message);
      }
      try {
        // await dbArg.run(typeObject.joinTopYears);
        // console.log(`Created table "top_${typeOption}_by_year".`);

        // get all unique years from the sessions table
        const yearsResult = await dbArg.exec('SELECT DISTINCT strftime("%Y", ts) as year FROM sessions ORDER BY year');
        const years = await yearsResult[0].values.map(value => ({ year: value[0] }));
        // console.log('years: ', years);

        // run byYear query for each year and create a temporary table
        for (const year of years) {
          const byYearQuery = `CREATE TABLE temp_${typeOption}_${year.year} AS ${typeObject.byYear(year.year)}`;
          await dbArg.exec(byYearQuery);
          // console.log(`Created table "temp_${typeOption}_${year.year}".`);
        }

        // unite all temporary tables into one table
        const unionQuery = `CREATE TABLE top_${typeOption}_by_year AS SELECT * FROM ${years.map(year => `temp_${typeOption}_${year.year}`).join(' UNION ALL SELECT * FROM ')}`;
        await dbArg.run(unionQuery);
        // console.log(`Created table "top_${typeOption}_by_year".`);

        // Optionally, drop the temporary tables
        for (const year of years) {
          // console.log('Dropping table: ', `temp_${typeOption}_${year.year}`);
          await dbArg.exec(`DROP TABLE temp_${typeOption}_${year.year}`);
        }
        // Reclaim unused space
        // await dbArg.exec(`VACUUM`);

      } catch (error) {
        console.error(`Error creating topYearTable "${typeOption}_by_year":`, error.message);
      }
    }));

    // Return true after all tables have been created
    return true;
  }
);

const getTrackUris = async (dbArg, tableName) => {
  try {
    const result = await dbArg.exec(`SELECT DISTINCT track_uri FROM ${tableName}`);
    return result[0].values.map(row => row[0]);
  } catch (error) {
    console.error(`Error fetching track URIs from ${tableName}:`, error);
    return [];
  }
};

const getTrackInfo = async (uri) => {
  const response = await fetch(`https://api.spotify.com/v1/tracks/${uri}?market=US`, {
    method: 'GET',
    // we call the getSpotifyToken function to get the token
    // which is either cached or gets refreshed (so to speak)
    headers: { 'Authorization': 'Bearer ' + await getSpotifyToken() },
  });
  // console.log('getTrackInfo response', response);
  return await response.json();
}

const updateTrackRecord = async (dbArg, tableName, uri, trackData) => {
  try {
    const updateSql = `
      UPDATE ${tableName}
      SET
        preview_url = ?,
        image_url = ?,
        popularity = ?,
        duration_ms = ?,
        explicit = ?,
        release_date = ?,
        album_uri = ?,
        artist_uri = ?,
        top_bool = ?
      WHERE track_uri = ?;
    `;

    await dbArg.run(updateSql, [
      trackData.preview_url || null,
      trackData.album.images[1].url || null,
      trackData.popularity,
      trackData.duration_ms,
      trackData.explicit,
      trackData.album.release_date,
      trackData.album.id,
      trackData.artists[0].id,
      1, // 1 is the value for top_bool, indicating that the track is in one of the top tracks tables
      uri
    ]);

    // console.log(`Updated track data for URI: ${uri} in table: ${tableName}`);
  } catch (error) {
    console.error(`Error updating track record for URI ${uri} in ${tableName}:`, error);
  }
};


export const fillTopRecordsViaApi = createAsyncThunk(
  'query/fillTopRecordsViaApi',
  async (dbArg, thunkAPI) => {
    console.log('fillTopRecordsViaApi: running...');


    // Fetch track URIs from top_tracks_allTime and top_tracks_by_year
    const trackUrisAllTime = await getTrackUris(dbArg, 'top_tracks_allTime');
    const trackUrisByYear = await getTrackUris(dbArg, 'top_tracks_by_year');

    // Combine and deduplicate URIs
    // Create a new set in order to filter out any duplicate track URIs from both the 'trackUrisAllTime' and 'trackUrisByYear' arrays.
    const allTrackUris = [...new Set([...trackUrisAllTime, ...trackUrisByYear])];
        // [...trackUrisAllTime, ...trackUrisByYear]: This creates a new array that combines the elements of trackUrisAllTime and trackUrisByYear.
        // new Set(): creates a new Set - a collectin of unqiue values, thereby removing duplicates - from the combined array
        // [...]: This creates a new array from the Set. We want an array back, not a set, so this transofrm is necessary.
            //By converting the Set back to an Array, we can use Array methods on the resulting collection of unique values.
const trackObjectFormat = []
    // Loop through each URI, fetch data from API, and update the tracks table
    for (const uri of allTrackUris) {
      try {
        const trackData = await getTrackInfo(uri); // Fetch track data from API
        // console.log('trackData', trackData);
        trackObjectFormat[0]=trackData
        await updateTrackRecord(dbArg, 'tracks', uri, trackData); // Update the tracks table
      } catch (error) {
        console.error(`Error fetching data for URI ${uri}:`, error);
        console.log('trackObjectFormat', trackObjectFormat);
      }
    }
    console.log('vacuuming...');
    // dbArg.run('VACUUM');
    console.log('trackObjectFormat', trackObjectFormat);
    // Update the top_tracks_allTime and top_tracks_by_year tables based on the updated tracks table
    // build these out next:
    // await updateTopTracksTables(dbArg, 'top_tracks_allTime');
    // await updateTopTracksTables(dbArg, 'top_tracks_by_year');


    }
);


export const syncTrackUris = createAsyncThunk(
  'query/syncTrackUris',
  async (dbArg) => {
    console.log('syncTrackUris: running...');
    const sql = `
    WITH Duplicates AS (
      SELECT
        artist_name,
        track_name,
        album_name,
        MIN(og_track_uri) as synced_track_uri
      FROM
        sessions
      GROUP BY
        artist_name,
        track_name,
        album_name
    )
    UPDATE sessions
    SET
      track_uri = COALESCE(
        (SELECT synced_track_uri FROM Duplicates
         WHERE Duplicates.artist_name = sessions.artist_name
           AND Duplicates.track_name = sessions.track_name
           AND Duplicates.album_name = sessions.album_name),
        og_track_uri
      );
  `;

    try {
      await dbArg.run(sql);
      console.log('Synced_track_uris have been set in sessions.');
      return false; // return false to indicate success, rather than returning nothing

    } catch (error) {
      console.error('Error updating synced_tracks:', error);
      return true
    }
    return false
  }
);


const querySlice = createSlice({
  name: 'query',
  initialState: {
    tracks: {
      allTime: `
        select
          track_name,
          artist_name,
          album_name,
          sum(ms_played) / 86400000 as total_days_played,
          sum(ms_played) / 3600000 as total_hours_played,
          sum(ms_played) / 60000 as total_minutes_played,
          sum(ms_played) as total_ms_played,
          count(*) as total_plays,
          track_uri
        from
          sessions
        where
          artist_name is not null
        group by
          track_name,
          artist_name
        order by
          total_minutes_played desc
        limit
        10`,
      byYear: (chosenYear) => `
        select
          track_name,
          album_name,
          artist_name,
          strftime('%Y', ts) as year,
          sum(ms_played) / 86400000 as total_days_played,
          sum(ms_played) / 3600000 as total_hours_played,
          sum(ms_played) / 60000 as total_minutes_played,
          sum(ms_played) as total_ms_played,
          count(*) as total_plays,
          track_uri
        from
          sessions
        where
          track_name is not null and
          artist_name is not null and
          strftime('%Y', ts) = '${chosenYear}'
        group by
            year,
            track_name,
            album_name,
            artist_name
        order by
          total_minutes_played desc
        limit
        10`,
      byYearByMonth: (chosenYear, chosenMonth) => `
        select
          strftime('%Y', ts) as year,
          strftime('%m', ts) as month,
          track_name,
          album_name,
          artist_name,
          sum(ms_played) / 86400000 as total_days_played,
          sum(ms_played) / 3600000 as total_hours_played,
          sum(ms_played) / 60000 as total_minutes_played,
          sum(ms_played) as total_ms_played,
          count(*) as total_plays,
          track_uri
        from
          sessions
        where
          artist_name is not null and
          strftime('%Y', ts) = '${chosenYear}' and
          strftime('%m', ts) = '${chosenMonth}'
        group by
            year,
            track_name,
            album_name,
            artist_name
        order by
          total_minutes_played desc
        limit
          10`,
        first: `
          select
            ts as timestamp,
            track_name,
            artist_name,
            album_name,
            strftime('%Y-%m-%d', ts) AS formatted_date,
            track_uri
          from
            sessions
          order by
            ts ASC
          limit
            1;
          `,
    },
    albums: {
      allTime: `
        select
          album_name,
          artist_name,
          sum(ms_played) / 86400000 as total_days_played,
          sum(ms_played) / 3600000 as total_hours_played,
          sum(ms_played) / 60000 as total_minutes_played,
          sum(ms_played) as total_ms_played,
          count(*) as total_plays
        from
          sessions
        where
          artist_name is not null
        group by
          album_name,
          artist_name
        order by
          total_minutes_played desc
        limit
        10`,
      byYear: (chosenYear) => `
        select
          album_name,
          artist_name,
          strftime('%Y', ts) as year,
          sum(ms_played) / 86400000 as total_days_played,
          sum(ms_played) / 3600000 as total_hours_played,
          sum(ms_played) / 60000 as total_minutes_played,
          sum(ms_played) as total_ms_played,
          count(*) as total_plays
        from
          sessions
        where
          artist_name is not null and
          strftime('%Y', ts) = '${chosenYear}'
        group by
            year,
            album_name,
            artist_name
        order by
          total_minutes_played desc
        limit
        10`,
      byYearByMonth: (chosenYear, chosenMonth) => `
        select
          strftime('%Y', ts) as year,
          strftime('%m', ts) as month,
          album_name,
          artist_name,
          sum(ms_played) / 86400000 as total_days_played,
          sum(ms_played) / 3600000 as total_hours_played,
          sum(ms_played) / 60000 as total_minutes_played,
          sum(ms_played) as total_ms_played,
          count(*) as total_plays
        from
          sessions
        where
          artist_name is not null and
          strftime('%Y', ts) = '${chosenYear}' and
          strftime('%m', ts) = '${chosenMonth}'
        group by
            year,
            album_name,
            artist_name
        order by
          total_minutes_played desc
        limit
        10`,
    },
    artists: {
      allTime: `
      select
        artist_name,
        sum(ms_played) / 86400000 as total_days_played,
        sum(ms_played) / 3600000 as total_hours_played,
        sum(ms_played) / 60000 as total_minutes_played,
        sum(ms_played) as total_ms_played,
        count(*) as total_plays
      from
        sessions
      where
        artist_name is not null
      group by
        artist_name
      order by
        total_minutes_played desc
      limit
        10`,
      byYear: (chosenYear) => `
        select
          strftime('%Y', ts) as year,
          artist_name,
          sum(ms_played) / 86400000 as total_days_played,
          sum(ms_played) / 3600000 as total_hours_played,
          sum(ms_played) / 60000 as total_minutes_played,
          sum(ms_played) as total_ms_played,
          count(*) as total_plays
        from
          sessions
        where
          artist_name is not null and
          strftime('%Y', ts) = '${chosenYear}'
        group by
            year,
            artist_name
        order by
          total_minutes_played desc
        limit
        10`,
      byYearByMonth: (chosenYear, chosenMonth) => `
      select
        strftime('%Y', ts) as year,
        strftime('%m', ts) as month,
        artist_name,
        sum(ms_played) / 86400000 as total_days_played,
        sum(ms_played) / 3600000 as total_hours_played,
        sum(ms_played) / 60000 as total_minutes_played,
        sum(ms_played) as total_ms_played,
        count(*) as total_plays
      from
        sessions
      where
        artist_name is not null and
        strftime('%Y', ts) = '${chosenYear}' and
        strftime('%m', ts) = '${chosenMonth}'
      group by
          year,
          artist_name
      order by
        total_minutes_played desc
      limit
        10`,
    },
    minutes: {
      total: `
        select
          sum(ms_played) / 86400000 as total_days_played,
          sum(ms_played) / 3600000 as total_hours_played,
          sum(ms_played) / 60000 as total_minutes_played
        from
          sessions`,
      byMonth: `
        select
          strftime('%m', ts) as month,
          sum(ms_played) / 60000 as total_minutes_played
        from
          sessions
        group by
          month`,
    },
    status: "idle",
    error: ""
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(makeClientTables.fulfilled, (state, action) => {
        console.log('makeClientTables.fulfilled');
        state.status = "success";
      })
      .addCase(makeClientTables.pending, (state, action) => {
        // console.log('makeClientTables.pending: action.payload:', action.payload);
        state.status = "loading";
      })
      .addCase(makeClientTables.rejected, (state, action) => {
        console.log('makeClientTables.rejected: action.payload:', action.payload);
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(viewClientTables.fulfilled, (state, action) => {
        console.log('viewClientTables.fulfilled');
        state.status = "success";
      })
      .addCase(viewClientTables.pending, (state, action) => {
        // console.log('viewClientTables.pending: action.payload:', action.payload);
        state.status = "loading";
      })
      .addCase(viewClientTables.rejected, (state, action) => {
        console.log('viewClientTables.rejected: action.payload:', action.payload);
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(syncTrackUris.fulfilled, (state, action) => {
        console.log('syncTrackUris.fulfilled');
        state.status = "success";
      })
      .addCase(syncTrackUris.pending, (state, action) => {
        // console.log('syncTrackUris.pending: action.payload:', action.payload);
        state.status = "loading";
      })
      .addCase(syncTrackUris.rejected, (state, action) => {
        console.log('syncTrackUris.rejected: action.payload:', action.payload);
        state.status = "failed";
        state.error = action.error.message;
      })
  },
});

// for debugging purposes. this logs the clientTables to the console, when invoked.
export const viewClientTables = createAsyncThunk(
  'query/viewClientTables',
  async (dbArg) => {
  const clientTables = [
    'top_tracks_allTime',
    'top_albums_allTime',
    'top_artists_allTime',
    'top_tracks_by_year',
    'top_albums_by_year',
    'top_artists_by_year',
  ]
  const results = await Promise.all(clientTables.map(async (tableName) => {
    try {
      const result = await dbArg.exec(`SELECT * FROM ${tableName};`);
      if (result.length === 0) {
        // The query succeeded but returned no results,
        // meaning the table exists but is empty.
        console.log(`Table "${tableName}" is empty.`);
      } else {
        console.log(`Contents of table "${tableName}":`);
        console.table(result[0].values);
      }
    } catch (error) {
      console.error(`Error viewing table "${tableName}":`, error.message);
    }
    })
  );
  return results;
});

export const { reducer: queryReducer, actions } = querySlice;

const apiSlice = (endpoint, filter) => {
  const actions = createAsyncThunk(
    `fetch/${endpoint}`,
    async (uri) => {
      let url = `/${endpoint}/${uri}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Fetch request failed at endpoint ${url}`);
      }
      const responseJson = await response.json();
      return responseJson;
    }
  );

  const reducer = createSlice({
    name: endpoint,
    initialState:{
      arrData: [],
      objData: {},
      year: "",
      status: "idle",
      error: "",
    },
    // extraReducers
    // - Defines additional reducer functions for a slice.
    // - Allows defining reducers for async actions (like below) in the current slice
    // - Or reducers for actions of other slices.
    // - Enhances the reducer logic of the current slice.
    extraReducers(builder) {
        // Redux Toolkit Builder
        // - Creates reusable, standardized slices of application state.
        // - Simplifies the typical Redux workflow.
        // - Auto-generates action creators and action types.
        builder
        .addCase(actions.pending, (state, action) => {
          state.status = "loading";
        })
        .addCase(actions.fulfilled, (state, action) => {
          state.status = "succeeded";
            state.arrData = action.payload;
            state.objData[action.meta.arg] = action.payload;

        })
        .addCase(actions.rejected, (state, action) => {
          console.log(`status REJECTED for ${endpoint} in slice.js`);
          state.status = "failed";
          state.error = action.error.message;
        })
        .addCase(fillTopRecordsViaApi.fulfilled, (state, action) => {
          console.log('fillTopRecordsViaApi.fulfilled');
          state.status = "success";
        })
        .addCase(fillTopRecordsViaApi.pending, (state, action) => {
          // console.log('fillTopRecordsViaApi.pending: action.payload:', action.payload);
          state.status = "loading";
        })
        .addCase(fillTopRecordsViaApi.rejected, (state, action) => {
          console.log('fillTopRecordsViaApi.rejected: action.payload:', action.payload);
          state.status = "failed";
          state.error = action.error.message;
        })
        .addCase(getTrackInfo.fulfilled, (state, action) => {
          console.log('getTrackInfo.fulfilled');
          state.status = "success";
        })
        .addCase(getTrackInfo.pending, (state, action) => {
          // console.log('getTrackInfo.pending: action.payload:', action.payload);
          state.status = "loading";
        })
        .addCase(getTrackInfo.rejected, (state, action) => {
          console.log('getTrackInfo.rejected: action.payload:', action.payload);
          state.status = "failed";
          state.error = action.error.message;
        })
    }
  });
  return { reducer, actions };
}

const { reducer: tracksApiReducer, actions: fetchTracksApi } = apiSlice('tracks/api');
