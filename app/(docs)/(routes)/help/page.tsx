import dayjs from "dayjs";
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

import { Time } from "./time";

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
        dateTime: data.meta.lastUpdated,
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
                <p>
                  Updated{" "}
                  <span>
                    <Time dateTime={posts.dateTime} />
                  </span>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
