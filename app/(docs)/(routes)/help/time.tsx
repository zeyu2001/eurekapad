"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const Time = ({ dateTime }: { dateTime: string }) => (
  <time dateTime={dayjs(dateTime).toISOString()}>
    {dayjs(dateTime).fromNow()}
  </time>
);
