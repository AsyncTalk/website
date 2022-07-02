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
        <main>
          <ul className='flex text-primary flex-col'>
            {posts.map((x: any) => (
              <Link
                key={x.slug}
                to={`/posts/${x.slug}`}
                className='hover:underline'
              >
                <h3 className='text-lg'>
                  {x.frontmatter.title}
                </h3>
              </Link>
            ))}
          </ul>
        </main>
      </>
    </PageLayout>
  )
}

export const query = graphql`
  query queryAllPodcasts {
    allMdx(sort: {fields: frontmatter___publicationDate, order: DESC}) {
      nodes {
        id
        frontmatter {
          title
        }
        slug
      }
    }
  }
`

export default PostsPage