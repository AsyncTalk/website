import * as React from "react"
import { Helmet } from "react-helmet"
import PageLayout from "../components/layout"

// markup
const IndexPage = () => {
  return (
    <PageLayout>
      <>
        <Helmet>
          <title>Async Talk Podcast</title>
        </Helmet>
        <main className='w-screen h-screen flex items-center justify-center'>
          <div>
            <span className='text-8xl text-center w-full block'>
              👨🏻‍💻
            </span>
            <h1 className='text-7xl mt-3'>Async Talk</h1>
          </div>
        </main>
      </>
    </PageLayout>
  )
}

export default IndexPage
