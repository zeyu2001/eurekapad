'use client'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function Time({ dateTime }: { dateTime: string }) {
  return <time dateTime={dayjs(dateTime).toISOString()}>{dayjs(dateTime).fromNow()}</time>
}
