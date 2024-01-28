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
    tracks:`
      ++id,
      track_uri,
      track_name,
      artist_name,
      album_name,
      explicit,
      popularity,
      duration_ms,
      track_number,
      disc_number,
      album_uri,
      album_id,
      album_release_date,
      album_name,
      album_images
    `,
    artists:`
      ++id,
      artist_uri,
      artist_name,
      artist_followers,
      artist_popularity,
      artist_genres,
      artist_images
    `,
    albums:`
      ++id,
      album_uri,
      album_name,
      album_id,
      album_release_date,
      album_images,
      album_artists,
      album_tracks,
      album_popularity
    `,
    sqlBinary:'++id, data',
});

export default dexdb;
