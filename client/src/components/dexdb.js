// dexdb.js

import Dexie from 'dexie';

const dexdb = new Dexie('backtrackDb');
dexdb.version(1).stores({
    sessions:`
      ++id,
      ts,
      platform,
      ms_played,
      country,
      ip_addr,
      user_agent,
      track,
      artist,
      album,
      track_uri,
      reason_start,
      reason_end,
      shuffle,
      skipped,
      offline,
      offline_timestamp,
      incognito_mode,
      timefn,
      unix_end,
      dt_added,
      artist_name,
      track_name,
      album_name,
      playtime_seconds,
      playtime_minutes,
      sesh_year,
      sesh_day,
      sesh_month
    `,
    sqlBinary:'++id, data',
    // You can add more tables (stores) if needed
});

export default dexdb;
