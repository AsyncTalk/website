import { graphql, Link } from 'gatsby'
import React from 'react'
import PageLayout from '../components/layout'
import SEOTags from '../components/seo/seo-tags'

type PostsPageProps = {
  data: any
}

function PostsPage(props: PostsPageProps) {
  const posts = props.data.allMdx.nodes
  return (
    <PageLayout>
      <>
        <SEOTags
          title='Posts'
          desc='AsyncTalk 是一档中文，面向对 web 开发感兴趣的朋友所录制的 Podcast 节目。 后续我们会讨论更多更为前沿，工程化的话题，感兴趣可以持续关注。 联系我们请发邮件至 async.talk@gmail.com 期待沟通。'
          urlPath="/posts"
        />
        <ul className='min-h-[250px] m-auto max-w-screen-lg flex text-primary flex-col'>
          {posts.map((x: any) => (
            <Link
              key={x.frontmatter.slug}
              to={`${x.frontmatter.slug}`}
              className='hover:underline'
            >
              <h3 className='text-lg p-1 mb-1'>
                {x.frontmatter.title}
              </h3>
            </Link>
          ))}
        </ul>
      </>
    </PageLayout>
  )
}

export const query = graphql`query queryAllPodcasts {
  allMdx(
    sort: {frontmatter: {publicationDate: DESC}}
    filter: {frontmatter: {status: {eq: "published"}}}
  ) {
    nodes {
      id
      frontmatter {
        slug
        title
      }
    }
  }
}`

export default PostsPage