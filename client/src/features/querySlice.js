import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const makeTempTables = createAsyncThunk(
  'query/makeTempTables',
  async (dbArg, { getState }) => {
    const { tracks, albums, artists } = getState().query;
    const typeMap = { tracks, albums, artists };
    const typeOptions = ['tracks', 'albums', 'artists'];
    console.log(`query/MakeTempTables: typeMap:`, typeMap);

    // Use Promise.all with map instead of forEach
    await Promise.all(typeOptions.map(async (typeOption) => {
      const typeObject = typeMap[typeOption];
      console.log('query/MakeTempTables: inside Promise.all map function. typeOption:', typeOption);

      try {
        console.log('query/MakeTempTables: inside the try, for the first time. trying to create allTime and byYear tables');
        const allTimeQuery = `CREATE TABLE ${typeOption}_allTime AS ${typeObject.allTime}`;
        await dbArg.exec(allTimeQuery);
        console.log(`Created table "${typeOption}_allTime".`);
        await dbArg.exec(typeObject.joinTopYears);
        console.log(`Created table "${typeOption}_allTime".`);
      } catch (error) {
        console.error(`Error creating table "${typeOption}_allTime":`, error.message);
      }
    }));

    // Return true after all tables have been created
    return true;
  }
);

export const viewTempTables = createAsyncThunk(
  'query/viewTempTables',
  async (dbArg, { getState }) => {
  const tempTables = [
    'tracks_allTime',
    'albums_allTime',
    'artists_allTime',
    'top_tracks_by_year',
    'top_albums_by_year',
    'top_artists_by_year',
  ]
  const results = await Promise.all(tempTables.map(async (table) => {
    try {
      const result = await db.exec(`SELECT * FROM ${tableName};`);
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
          track_uri,
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
      joinTopYears:`
      CREATE TABLE top_tracks_by_year AS
      SELECT
      s.year,
      s.track_name,
      s.album_name,
      s.track_uri,
      s.total_days_played,
      s.total_hours_played,
      s.total_minutes_played,
      s.total_ms_played,
      s.total_plays
    FROM (
      SELECT
        strftime('%Y', ts) as year,
        track_name,
        album_name,
        track_uri,
        sum(ms_played) / 86400000 as total_days_played,
        sum(ms_played) / 3600000 as total_hours_played,
        sum(ms_played) / 60000 as total_minutes_played,
        sum(ms_played) as total_ms_played,
        count(*) as total_plays
      FROM
        sessions
      WHERE
        track_name is not null AND album_name is not null
      GROUP BY
        year,
        track_name,
        album_name
    ) s
    WHERE (
      SELECT
        count(*)
      FROM (
        SELECT
          strftime('%Y', ts) as year,
          track_name,
          album_name,
          track_uri,
          sum(ms_played) / 86400000 as total_days_played,
          sum(ms_played) / 3600000 as total_hours_played,
          sum(ms_played) / 60000 as total_minutes_played,
          sum(ms_played) as total_ms_played,
          count(*) as total_plays
        FROM
          sessions
        WHERE
          track_name is not null AND album_name is not null
        GROUP BY
          year,
          track_name,
          album_name
      ) s2
      WHERE
        s2.year = s.year AND s2.total_minutes_played > s.total_minutes_played
    ) < 10
    ORDER BY
      s.year desc,
      s.total_minutes_played desc
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
      joinTopYears:`
        CREATE TABLE top_albums_by_year AS
        SELECT
          s.year,
          s.album_name,
          s.artist_name,
          s.total_days_played,
          s.total_hours_played,
          s.total_minutes_played,
          s.total_ms_played,
          s.total_plays
        FROM (
          SELECT
            strftime('%Y', ts) as year,
            album_name,
            artist_name,
            sum(ms_played) / 86400000 as total_days_played,
            sum(ms_played) / 3600000 as total_hours_played,
            sum(ms_played) / 60000 as total_minutes_played,
            sum(ms_played) as total_ms_played,
            count(*) as total_plays
          FROM
            sessions
          WHERE
            album_name is not null AND artist_name is not null
          GROUP BY
            year,
            album_name,
            artist_name
        ) s
        WHERE (
          SELECT
            count(*)
          FROM (
            SELECT
              strftime('%Y', ts) as year,
              album_name,
              artist_name,
              sum(ms_played) / 86400000 as total_days_played,
              sum(ms_played) / 3600000 as total_hours_played,
              sum(ms_played) / 60000 as total_minutes_played,
              sum(ms_played) as total_ms_played,
              count(*) as total_plays
            FROM
              sessions
            WHERE
              album_name is not null
            GROUP BY
              year,
              album_name,
              artist_name
          ) s2
          WHERE
            s2.year = s.year AND s2.total_minutes_played > s.total_minutes_played
        ) < 10
        ORDER BY
          s.year desc,
          s.total_minutes_played desc
            `,
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
      joinTopYears:`
        CREATE TABLE top_artists_by_year AS
        SELECT
          s.year,
          s.artist_name,
          s.total_days_played,
          s.total_hours_played,
          s.total_minutes_played,
          s.total_ms_played,
          s.total_plays
        FROM (
          SELECT
            strftime('%Y', ts) as year,
            artist_name,
            sum(ms_played) / 86400000 as total_days_played,
            sum(ms_played) / 3600000 as total_hours_played,
            sum(ms_played) / 60000 as total_minutes_played,
            sum(ms_played) as total_ms_played,
            count(*) as total_plays
          FROM
            sessions
          WHERE
            artist_name is not null
          GROUP BY
            year,
            artist_name
        ) s
        WHERE (
          SELECT
            count(*)
          FROM (
            SELECT
              strftime('%Y', ts) as year,
              artist_name,
              sum(ms_played) / 86400000 as total_days_played,
              sum(ms_played) / 3600000 as total_hours_played,
              sum(ms_played) / 60000 as total_minutes_played,
              sum(ms_played) as total_ms_played,
              count(*) as total_plays
            FROM
              sessions
            WHERE
              artist_name is not null
            GROUP BY
              year,
              artist_name
          ) s2
          WHERE
            s2.year = s.year AND s2.total_minutes_played > s.total_minutes_played
        ) < 10
        ORDER BY
          s.year desc,
          s.total_minutes_played desc
            `,
    },
    combineTrackUris:{
      step1:`
      WITH Duplicates AS (
      SELECT
        artist_name,
        track_name,
        album_name,
        MIN(track_uri) as common_uri
      FROM
        sqlDb
      GROUP BY
        artist_name,
        track_name,
        album_name
      HAVING
        COUNT(DISTINCT track_uri) > 1
      )`,
      step2:`
      UPDATE sqlDb
      SET
        track_uri = (
          SELECT common_uri
          FROM Duplicates
          WHERE
            Duplicates.artist_name = sqlDb.artist_name AND
            Duplicates.track_name = sqlDb.track_name AND
            Duplicates.album_name = sqlDb.album_name
        )
      WHERE EXISTS (
        SELECT 1
        FROM Duplicates
        WHERE
          Duplicates.artist_name = sqlDb.artist_name AND
          Duplicates.track_name = sqlDb.track_name AND
          Duplicates.album_name = sqlDb.album_name
      )`
    },
    status: "idle",
    error: ""
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(makeTempTables.fulfilled, (state, action) => {
        console.log('makeTempTables.fulfilled: action.payload:', action.payload);
        state.status = "success";
      })
      .addCase(makeTempTables.pending, (state, action) => {
        console.log('makeTempTables.pending: action.payload:', action.payload);
        state.status = "loading";
      })
      .addCase(makeTempTables.rejected, (state, action) => {
        console.log('makeTempTables.rejected: action.payload:', action.payload);
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(viewTempTables.fulfilled, (state, action) => {
        console.log('viewTempTables.fulfilled: action.payload:', action.payload);
        state.status = "success";
      })
      .addCase(viewTempTables.pending, (state, action) => {
        console.log('viewTempTables.pending: action.payload:', action.payload);
        state.status = "loading";
      })
      .addCase(viewTempTables.rejected, (state, action) => {
        console.log('viewTempTables.rejected: action.payload:', action.payload);
        state.status = "failed";
        state.error = action.error.message;
      })

      // Similarly, handle the state updates for the other async thunks
  },
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
    }
  });
  return { reducer, actions };
}

const { reducer: tracksApiReducer, actions: fetchTracksApi } = apiSlice('tracks/api');
