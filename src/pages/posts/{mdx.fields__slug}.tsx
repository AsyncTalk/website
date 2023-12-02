import { graphql, Link } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import IconExternalLink from '../../components/icons/external-link'
import PageLayout from '../../components/layout'
import SEOTags from '../../components/seo/seo-tags'
import Heading1 from '../../components/markdown/Heading1'
import Heading2 from '../../components/markdown/Heading2'
import Heading3 from '../../components/markdown/Heading3'
import Heading4 from '../../components/markdown/Heading4'
import Heading5 from '../../components/markdown/Heading5'
import Heading6 from '../../components/markdown/Heading6'
import KeyValueInfo from '../../components/kv-info'
import Tags from '../../components/tags/tags'
import A from '../../components/markdown/A'
import WarningAlert from '../../components/alert/warning'

type MDXSlugPageProps = {
  data: Queries.FetchPostQuery
  children: React.ReactElement
}

function MDXSlugPage(props: MDXSlugPageProps) {
  const { data } = props
  const frontData = data.mdx?.frontmatter

  if (!frontData) {
    return null
  }

  const tags = frontData.categories?.filter(x => x) as string[] ?? []
  const isPreRelease = frontData.status === 'pending'

  return (
    <PageLayout>
      <>
        <SEOTags
          title={frontData.title ?? ''}
          desc={frontData.title ?? ''}
          urlPath={frontData.slug ?? ''}
          keywords={tags}
        />
        <div
          className="min-h-[250px] m-auto max-w-screen-lg text-primary w-full px-4 md:pt-10"
        >
          {isPreRelease && (
            <WarningAlert
              title='预发布内容'
              description='请注意. 此内容正在预发布中，内容可能会更改.'
            />
          )}
          <Link
            to={frontData.slug!}
            className='hover:underline'
          >
            <h1 className='text-3xl font-bold'>{frontData.title}</h1>
          </Link>
          {/* <h3 className='text-lg mt-2'>{frontData.subtitle}</h3> */}
          <time
            className='text-xs mt-2'
            dateTime={frontData.publicationDate ?? undefined}
            title={frontData.publicationDate ?? undefined}
          >
            {new Intl.DateTimeFormat().format(new Date(frontData.publicationDate as string))}
          </time>

          <KeyValueInfo
            title='收听渠道'
            value={
              <Link
                to={frontData.xyzLink!}
                className='flex items-center justify-center hover:underline'
                target='_blank'
                referrerPolicy='no-referrer'
              >
                小宇宙 - {frontData.title}
                <IconExternalLink
                  className='scale-75 -translate-y-1'
                />
              </Link>
            }
          />

          {frontData.draftLink && (
            <KeyValueInfo
              title='草稿链接'
              value={
                <Link
                  to={frontData.draftLink}
                  className='flex items-center justify-center hover:underline'
                  target='_blank'
                  referrerPolicy='no-referrer'
                >
                  Notion - {frontData.title}
                  <IconExternalLink
                    className='scale-75 -translate-y-1'
                  />
                </Link>
              }
            />
          )}

          {tags.length > 0 && (
            <KeyValueInfo
              title='Tags'
              value={(
                <Tags
                  tags={tags}
                />
              )}
            />
          )}

          <hr className='my-10 border-primary' />

          <article className=' leading-loose w-full at-mdx-content at-scrollbar text-gray-100 break-all'>
            <MDXProvider
              components={{
                h1: Heading1,
                h2: Heading2,
                h3: Heading3,
                h4: Heading4,
                h5: Heading5,
                h6: Heading6,
                a: A,
              }}
            >
              {props.children}
            </MDXProvider>
            <hr className='my-10 border-primary' />
          </article>
        </div>
      </>
    </PageLayout>
  )
}

export const query = graphql`
query FetchPost($id: String) {
  mdx(id: {eq: $id}) {
    frontmatter {
      title
      slug
      publicationDate
      subtitle
      url
      xyzLink
      draftLink
      categories
      status
    }
    body
  }
}
`

export default MDXSlugPage