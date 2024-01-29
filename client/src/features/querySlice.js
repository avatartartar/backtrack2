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
          strftime('%Y', ts) as year,
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
          strftime('%Y', ts) as year,
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

export {
  queryReducer,
  setQuery,
};
