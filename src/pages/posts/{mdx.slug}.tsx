import { graphql, Link } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import React from 'react'
import IconExternalLink from '../../components/icons/external-link'
import PageLayout from '../../components/layout'
import SEOTags from '../../components/seo/seo-tags'

type MDXSlugPageProps = {
  data: any
}

function MDXSlugPage(props: MDXSlugPageProps) {
  const data = props.data
  return (
    <PageLayout>
      <>
        <SEOTags
          title={data.mdx.frontmatter.title}
          desc={data.mdx.frontmatter.title}
          urlPath={'/posts/' + data.mdx.slug}
        />
        <div
          className="min-h-[250px] m-auto max-w-screen-lg text-primary w-full px-4 md:pt-10"
        >
          <Link
            to={`/posts/${data.mdx.slug}`}
            className='hover:underline'
          >
            <h1 className='text-3xl font-bold'>{data.mdx.frontmatter.title}</h1>
          </Link>
          <h3 className='text-lg mt-2'>{data.mdx.frontmatter.subtitle}</h3>
          <time className='text-xs mt-2'>
            {new Intl.DateTimeFormat().format(new Date(data.mdx.frontmatter.publicationDate))}
          </time>

          <div className='flex items-start justify-start mt-2'>
            <span className='mr-1 whitespace-nowrap'>收听渠道: </span>
            <Link
              to={data.mdx.frontmatter.xyzLink}
              className='flex items-center justify-center hover:underline'
              target='_blank'
              referrerPolicy='no-referrer'
            >
              小宇宙 - {data.mdx.frontmatter.title}
              <IconExternalLink
                className='scale-75 -translate-y-1'
              />
            </Link>
          </div>

          <hr className='my-10 border-primary' />

          <article className=' leading-loose w-full at-mdx-content at-scrollbar text-gray-100 break-all'>
            <MDXRenderer
              title={data.mdx.frontmatter.title}
            >
              {data.mdx.body}
            </MDXRenderer>
            <hr className='my-10 border-primary' />

          </article>
        </div>
      </>
    </PageLayout>
  )
}

export const query = graphql`
  query ($id: String) {
    mdx(id: {eq: $id}) {
      frontmatter {
        title
        publicationDate
        subtitle
        url
        xyzLink
      }
      body
      slug
    }
  }
`

export default MDXSlugPage