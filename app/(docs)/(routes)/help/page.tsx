import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { glob } from "glob";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

dayjs.extend(relativeTime);

export default function Help() {
  const posts = glob
    .sync(`content/**/*.mdx`)
    .map((file) => file.split("/")[2].replace(/ /g, "-").slice(0, -4).trim())
    .map((slug) => {
      const data = require(`@/content/help/${slug}.mdx`);
      return {
        id: slug,
        title: data.meta.title,
        href: `/help/${slug}`,
        date: dayjs(data.meta.lastUpdated).fromNow(),
        dateTime: dayjs(data.meta.lastUpdated).toISOString(),
      };
    })
    .sort((a, b) => dayjs(b.dateTime).unix() - dayjs(a.dateTime).unix());

  return (
    <div className="px-6 py-32 lg:px-8 mx-auto max-w-3xl text-base leading-7 text-gray-700 dark:text-gray-300">
      <div className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Help Center</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <ul role="list" className="divide-y divide-gray-100 dark:divide-gray-800">
        {posts.map((posts) => (
          <li
            key={posts.id}
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowrap"
          >
            <div>
              <p className="font-semibold leading-6 text-gray-900 dark:text-gray-100">
                <Link href={posts.href} className="hover:underline">
                  {posts.title}
                </Link>
              </p>
              <div className="mt-1 flex items-center gap-x-2 text-sm leading-5 text-gray-500 dark:text-gray-400">
                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <p>
                  <time dateTime={posts.dateTime}>{posts.date}</time>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
