import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTrackRequest } from "./getTrackRequest.js";

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
    // This allows us to run all the queries concurrently, rather than one after the other.
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
        // console.log(`Created table "top_${typeOption}_byYear".`);

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
        const unionQuery = `CREATE TABLE top_${typeOption}_byYear AS SELECT * FROM ${years.map(year => `temp_${typeOption}_${year.year}`).join(' UNION ALL SELECT * FROM ')}`;
        await dbArg.run(unionQuery);
        // console.log(`Created table "top_${typeOption}_byYear".`);

        // drop the temporary tables
        for (const year of years) {
          // console.log('Dropping table: ', `temp_${typeOption}_${year.year}`);
          await dbArg.exec(`DROP TABLE temp_${typeOption}_${year.year}`);
        }
        // Reclaim unused space
        // await dbArg.exec(`VACUUM`);

      } catch (error) {
        console.error(`Error creating topYearTable "${typeOption}_byYear":`, error.message);
      }
    }));

    // Return true after all tables have been created
    return true;
  }
);

const queryTrackUris = async (dbArg, tableName) => {
  const uriField = tableName.includes('tracks') ? 'track_uri' : 'rep_track_uri';
  try {
    const result = await dbArg.exec(`SELECT DISTINCT ${uriField} FROM ${tableName}`);
    return result[0].values.map(row => row[0]);
  } catch (error) {
    console.error(`Error fetching track URIs from ${tableName}:`, error);
    return [];
  }
};


const updateTopTrackRecord = async (dbArg, tableName, uri, trackData) => {
      // JavaScript's optional chaining syntax ('?.'):
      // This allows us to access deeply nested object properties without worrying if the property exists or not.
      // You precede the property you want to access with a question mark, before the period.
      // basically, '?.album' = 'is there something at album' ? 'return the something' : then don't go any further, dont error, instead return undefined.
      // but i'd rather have a value, so we use || instead to specify a default value: in this case, null.
  const previewUrl = trackData?.preview_url || null;
  const imageUrl = trackData?.album?.images?.[1]?.url || trackData?.album?.images?.[0]?.url || null;

  const updateSql = `
    UPDATE ${tableName}
    SET
      preview_url = ?,
      image_url = ?
    WHERE track_uri = ?;
  `;

  try {
    await dbArg.run(updateSql, [previewUrl, imageUrl, uri]);
  } catch (error) {
    console.error(`QuerySlice/updateTopTrackRecord: Error updating track record for URI ${uri}:`, error);
  }
};

const updateTopAlbumRecord = async (dbArg, tableName, uri, albumData) => {
  const imageUrl = albumData?.album?.images?.[1]?.url || albumData?.album?.images?.[0]?.url || null;

  const updateSql = `
    UPDATE ${tableName}
    SET
      image_url = ?
    WHERE rep_track_uri = ?;
  `;

  try {
    await dbArg.run(updateSql, [imageUrl, uri]);
  } catch (error) {
    console.error(`QuerySlice/updateTopAlbumRecord: Error updating track record for URI ${uri}:`, error);
  }
};

export const fillTopRecordsViaApi = createAsyncThunk(
  'query/fillTopRecordsViaApi',
  async (dbArg, thunkAPI) => {
    console.log('fillTopRecordsViaApi/tracks: running...');

    // Fetch track URIs from top_tracks_allTime and top_tracks_byYear
    const fillTopTracks = async () => {
    const trackUrisAllTime = await queryTrackUris(dbArg, 'top_tracks_allTime');
    const trackUrisByYear = await queryTrackUris(dbArg, 'top_tracks_byYear');
    // Combine and deduplicate URIs
    const allTrackUris = [...new Set([...trackUrisAllTime, ...trackUrisByYear])];
    // Create a new set in order to filter out any duplicate track URIs from both the 'trackUrisAllTime' and 'trackUrisByYear' arrays.
        // [...trackUrisAllTime, ...trackUrisByYear]: This creates a new array that combines the elements of trackUrisAllTime and trackUrisByYear.
        // new Set(): creates a new Set - a collectin of unqiue values, thereby removing duplicates - from the combined array
        // [...]: This creates a new array from the Set. We want an array back, not a set, so this transofrm is necessary.
            //By converting the Set back to an Array, we can use Array methods on the resulting collection of unique values.
    // console.log('allTrackUris', allTrackUris);


    // PROMISE.ALL
    // This allows us to fetch all of the track data concurrently! Rather than having to resolve each promise one by one.
    // This is a huge performance improvement, especially when dealing with a large number of fetches.
    // It's reducing the duration to update all of the records given from 26 seconds to .6 seconds!!
    // Instead of the sum of all fetches, it's the duration of the longest fetch. Crazy.

    // Creating an array of promises for each track URI fetch
    const fetchTrackPromises = allTrackUris.map(uri => getTrackRequest(uri).then(data => ({uri, data})).catch(error => ({uri, error})));
    // Waiting for all fetches to complete
    const trackResults = await Promise.allSettled(fetchTrackPromises);
    // Gettting the number of rejected promises
    const rejectedTrackCount = trackResults.filter(result => result.status === 'rejected').length;
    console.log('rejectedTrackCount', rejectedTrackCount);
    // Loop through each URI, fetch data from API, and update the tracks table
    // Iterate through results to update records
    for (const result of trackResults) {
      if (result.status === 'fulfilled' && !result.value.error) {
        try {
          // Extract URI and trackData from the resolved promise
          const { uri, data: trackData } = result.value;
          await updateTopTrackRecord(dbArg, 'top_tracks_allTime', uri, trackData);
          await updateTopTrackRecord(dbArg, 'top_tracks_byYear', uri, trackData);
        } catch (updateError) {
          // console.error(`QuerySlice 202: Error updating track record for URI ${result.value.uri}:`, updateError);
          console.error(`QuerySlice 202: Error updating track record`);
        }
      } else {
        // console.error(`QuerySlice 205: Error fetching data for URI ${result.value.uri}:`, result.value.error);
        console.error(`QuerySlice 205: Error fetching data for URI`);

      }
    }
  }
  await fillTopTracks();

  const fillTopAlbums = async () => {
    console.log('fillTopRecordsViaApi/albums: running...');
    const albumUrisByYear = await queryTrackUris(dbArg, 'top_albums_byYear');
    const albumUrisAllTime = await queryTrackUris(dbArg, 'top_albums_allTime');
    const allAlbumUris = [...new Set([...albumUrisByYear, ...albumUrisAllTime])];
    // console.log('allAlbumUris', allAlbumUris);
    // Creating an array of promises for each track URI fetch, but for albums
    const fetchAlbumPromises = allAlbumUris.map(uri => getTrackRequest(uri).then(data => ({uri, data})).catch(error => ({uri, error})));

    // Wait for all fetches to complete
    const albumResults = await Promise.allSettled(fetchAlbumPromises);
    const rejectedAlbumCount = albumResults.filter(result => result.status === 'rejected').length;
    console.log('rejectedAlbumCount', rejectedAlbumCount);
    // const albumSchema = []
    for (const result of albumResults) {
      if (result.status === 'fulfilled' && !result.value.error) {
        try {
          // Extract URI and albumData from the resolved promise
          const { uri, data: albumData } = result.value;
          await updateTopAlbumRecord(dbArg, 'top_albums_allTime', uri, albumData);
          await updateTopAlbumRecord(dbArg, 'top_albums_byYear', uri, albumData);
        } catch (updateError) {
          // console.error(`QuerySlice/fillTopRecords: Error updating album record for URI ${result.value.uri}:`, updateError);
          console.error(`QuerySlice/fillTopRecords/albums: Error updating album record`);

        }
      } else {
        // console.error(`QuerySlice/fillTopRecords/albums: Error fetching data for URI ${result.value.uri}:`, result.value.error);
        console.error(`QuerySlice/fillTopRecords/albums: Error fetching data for URI`);

      }
    }
  }
  await fillTopAlbums();
  }
);

function convertSqlToJson(sqlResult) {
  if (!sqlResult[0] || !sqlResult[0].columns || !sqlResult[0].values) return [];
  return sqlResult[0].values.map(row => {
    const rowObject = {};
    row.forEach((value, index) => {
      rowObject[sqlResult[0].columns[index]] = value;
    });
    return rowObject;
  });
}

export const makeCategoryJson = createAsyncThunk(
  'top/makeCategoryJson',
  async (dbArg, { rejectWithValue }) => {
    const categories = ['tracks', 'artists', 'albums'];
    let categoryData = {};

    try {
      for (const category of categories) {
        // Initialize category object
        categoryData[category] = {};

        // Fetch and structure allTime data
        const allTimeSqlResult = await dbArg.exec(`SELECT * FROM top_${category}_allTime LIMIT 10`);
        categoryData[category]['allTime'] = convertSqlToJson(allTimeSqlResult);

        // Fetch and structure byYear data
        const byYearSqlResult = await dbArg.exec(`SELECT * FROM top_${category}_byYear ORDER BY year ASC, total_minutes_played DESC`);
        const byYearDataRaw = convertSqlToJson(byYearSqlResult);

        byYearDataRaw.forEach(record => {
          const year = record.year.toString();
          if (!categoryData[category][year]) {
            categoryData[category][year] = [];
          }
          categoryData[category][year].push(record);
        });
      }
      return categoryData;
    } catch (error) {
      console.error(`Error structuring data for categories:`, error);
      return rejectWithValue('logerror: Failed to structure category data');
    }
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
          track_uri,
          NULL as preview_url,
          NULL as image_url,
          NULL as popularity,
          NULL as duration_ms,
          NULL as explicit,
          NULL as release_date,
          1 as top_bool,
          NULL as album_uri,
          NULL as artist_uri
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
          track_uri,
          NULL as preview_url,
          NULL as image_url,
          NULL as popularity,
          NULL as duration_ms,
          NULL as explicit,
          NULL as release_date,
          1 as top_bool,
          NULL as album_uri,
          NULL as artist_uri
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
          track_uri,
          NULL as preview_url,
          NULL as image_url,
          NULL as popularity,
          NULL as duration_ms,
          NULL as explicit,
          NULL as release_date,
          1 as top_bool,
          NULL as album_uri,
          NULL as artist_uri
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
            track_uri,
            NULL as preview_url,
            NULL as image_url,
            NULL as popularity,
            NULL as duration_ms,
            NULL as explicit,
            NULL as release_date,
            1 as top_bool,
            NULL as album_uri,
            NULL as artist_uri
          from
            sessions
          order by
            ts ASC
          limit
            1;
          `,
          firstAndLast: `
          select
            ts as timestamp,
            track_name,
            artist_name,
            album_name,
            strftime('%Y-%m-%d', ts) AS formatted_date,
            track_uri,
            NULL as preview_url,
            NULL as image_url,
            NULL as popularity,
            NULL as duration_ms,
            NULL as explicit,
            NULL as release_date,
            1 as top_bool,
            NULL as album_uri,
            NULL as artist_uri
          from
            sessions
          order by
            ts ASC
          limit
            1;
          select
            ts as timestamp,
            track_name,
            artist_name,
            album_name,
            strftime('%Y-%m-%d', ts) AS formatted_date,
            track_uri,
            NULL as preview_url,
            NULL as image_url
          from
            sessions
          order by
            ts DESC
          limit
            1;`,
          skippedTracks:`
          select
            track_name,
            artist_name,
            album_name,
          count (*)
          as
            skipped_count
          from
            sessions
          where
            skipped = TRUE
          group by
            track_name
          order by
            skipped_count desc
          limit
            10`
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
          count(*) as total_plays,
          MIN(track_uri) as rep_track_uri,
          1 as top_bool,
          NULL as album_uri,
          NULL as artist_uri,
          NULL as image_url
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
          count(*) as total_plays,
          MIN(track_uri) as rep_track_uri,
          1 as top_bool,
          NULL as album_uri,
          NULL as artist_uri,
          NULL as image_url
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
        1`,
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
          count(*) as total_plays,
          MIN(track_uri) as rep_track_uri,
          1 as top_bool,
          NULL as album_uri,
          NULL as artist_uri,
          NULL as image_url
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
        count(*) as total_plays,
        MIN(track_uri) as rep_track_uri,
        1 as top_bool,
        NULL as artist_uri
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
          count(*) as total_plays,
          MIN(track_uri) as rep_track_uri,
          1 as top_bool,
          NULL as artist_uri
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
        count(*) as total_plays,
        MIN(track_uri) as rep_track_uri,
        1 as top_bool,
        NULL as artist_uri
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
        skipped:`
        SELECT
          artist_name,
        COUNT(*) AS
          skipped_count
        FROM
          sessions
        WHERE
          skipped = TRUE
        GROUP BY
          artist_name
        ORDER BY
          skipped_count DESC
        LIMIT
        10
        `
    },
    listeningTime: {
      totals: `
        select
          sum(ms_played) / 86400000 as total_days_played,
          sum(ms_played) / 3600000 as total_hours_played,
          sum(ms_played) / 60000 as total_minutes_played
        from
          sessions`,
      daysByMonth: `
        select
          strftime('%m', ts) as month,
          sum(ms_played) / 86400000 as total_days_played
        from
          sessions
        group by
          month`,
      hoursByMonth: `
        select
          strftime('%m', ts) as month,
          sum(ms_played) / 3600000 as total_hours_played
        from
          sessions
        group by
          month`,
      minutesByMonth: `
      select
        strftime('%m', ts) as month,
        sum(ms_played) / 3600000 as total_hours_played
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
    'top_tracks_byYear',
    'top_albums_byYear',
    'top_artists_byYear',
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
        .addCase(getTrackRequest.fulfilled, (state, action) => {
          console.log('getTrackRequest.fulfilled');
          state.status = "success";
        })
        .addCase(getTrackRequest.pending, (state, action) => {
          // console.log('getTrackRequest.pending: action.payload:', action.payload);
          state.status = "loading";
        })
        .addCase(getTrackRequest.rejected, (state, action) => {
          console.log('getTrackRequest.rejected: action.payload:', action.payload);
          state.status = "failed";
          state.error = action.error.message;
        })
    }
  });
  return { reducer, actions };
}

const { reducer: tracksApiReducer, actions: fetchTracksApi } = apiSlice('tracks/api');


// const updateArtistRecord = async (dbArg, uri, artistData) => {
//   try {
//     const updateSql = `
//       UPDATE artists
//       SET
//         genres = ?,
//         top_bool = ?
//       WHERE rep_track_uri = ?;
//     `;
//     await dbArg.run(updateSql, [
//       artistData.artist[0].genres.join(', ') || null,
//       1, // 1 is the value for top_bool, indicating that the track is in one of the top tracks tables
//       uri
//     ]);
//   } catch (error) {
//     console.error(`Error updating artist record for track_URI ${uri}:`, error);
//   }
// };

// fillTopRecordsViaApi
// previously below allAlbumUris
    // const artistUrisAllTime = await queryTrackUris(dbArg, 'top_artists_allTime');
    // const artistUrisByYear = await queryTrackUris(dbArg, 'top_artists_byYear');
    // const allArtistUris = [...new Set([...artistUrisAllTime, ...artistUrisByYear])];
    // console.log('allArtistUris', allArtistUris);

    // below albumSchema loop
        // const artistSchema = []
    // for (const uri of allArtistUris) {
    //   try {
    //     const artistData = await getTrackRequest(uri); // Fetch artist data from API
    //     // console.log('artistData', artistData);
    //     artistSchema[0]=artistData
    //     await updateArtistRecord(dbArg, uri, artistData); // Update the artists table
    //   } catch (error) {
    //     console.error(`Error fetching data for URI ${uri}:`, error);
    //     // console.log('artistSchema', artistSchema);
    //   }
    // }
    // console.log('artistSchema', artistSchema);

    // console.log('vacuuming...');
    // dbArg.run('VACUUM');


    // from updateTopTrackRecord
    // popularity = ?,
    // duration_ms = ?,
    // explicit = ?,
    // release_date = ?
