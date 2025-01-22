import { glob } from 'glob'
import { notFound } from 'next/navigation'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getTitle } from '@/lib/utils'

/**
 * Content of help pages is stored in the `/content/help` directory.
 * We automatically generate static paths for all the files in the directory.
 **/

async function getContent(params: { slug: string }) {
  try {
    const data = await import(`@/content/help/${params.slug}.mdx`)

    return {
      mdx: data.default,
      meta: data.meta,
    }
  } catch {
    notFound()
  }
}

export function generateStaticParams() {
  // getting all .mdx files from the posts directory
  const posts = glob.sync(`*.mdx`, { cwd: 'content/help/' })

  // converting the file names to their slugs
  const postSlugs = posts.map(file => file.replace(/ /g, '-').slice(0, -4).trim())

  // creating a path for each of the `slug` parameter
  return postSlugs.map(slug => {
    return { slug: slug }
  })
}

export default async function Content(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const content = await getContent(params)

  return (
    <>
      <title>{getTitle(content.meta.title)}</title>
      <div className="px-6 py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700 dark:text-gray-300">
          <div className="mb-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbLink href="/help">Help Center</BreadcrumbLink>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{content.meta.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <p className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
            Last updated {content.meta.lastUpdated}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
            {content.meta.title}
          </h1>
          <div
            className="mt-10 space-y-4 prose-headings:mt-8 
                  prose-headings:font-bold prose-headings:text-black prose-headings:tracking-tight
                  prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg 
                  dark:prose-headings:text-white
                  prose-ul:list-disc prose-ul:ml-8 prose-ol:list-decimal prose-ol:ml-8
                  prose-a:text-blue-600 dark:prose-a:text-blue-400"
          >
            {content.mdx()}
          </div>
        </div>
      </div>
    </>
  )
}
