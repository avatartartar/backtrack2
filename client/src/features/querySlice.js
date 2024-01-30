import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


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
  reducers: {
    setQuery: (state, action) => {
      state.queries[action.meta.arg] = action.payload;
    }
  },
});

const { reducer: queryReducer, actions: queryActions } = querySlice;
const { setQuery } = queryActions;


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

export {
  queryReducer,
  setQuery,
};
