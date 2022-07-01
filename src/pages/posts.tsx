import { graphql, Link } from 'gatsby'
import React from 'react'
import PageLayout from '../components/layout'

type PostsPageProps = {
  data: any
}

function PostsPage(props: PostsPageProps) {
  console.log('data', props.data)
  return (
    <PageLayout>
      <div>
        hello world
        <Link to={`${'/ep0'}`}>xxx</Link>
      </div>
    </PageLayout>
  )
}

export const query = graphql`
  query queryAllPodcasts {
    allMdx {
      nodes {
        id
        slug
      }
    }
  }
`

export default PostsPage