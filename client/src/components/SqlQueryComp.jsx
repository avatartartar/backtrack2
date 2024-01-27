
import React from "react";
import { setQuery } from "../features/slice.js";

const SqlQueryComp = {}

SqlQueryComp.topTracks =
    `select
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
      10`




export default SqlQueryComp;
