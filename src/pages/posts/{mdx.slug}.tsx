import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import React from 'react'
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
          <h1 className=' text-3xl font-bold'>{data.mdx.frontmatter.title}</h1>
          <h3 className=' text-lg mt-2'>{data.mdx.frontmatter.subtitle}</h3>
          <time className='text-xs mt-2'>
            {new Intl.DateTimeFormat().format(new Date(data.mdx.frontmatter.publicationDate))}
          </time>
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
      }
      body
      slug
    }
  }
`

export default MDXSlugPage