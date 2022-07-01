import * as React from "react"
import { Helmet } from "react-helmet"
import PageLayout from "../components/layout"
import SEOHomePage from "../components/seo/home"

// markup
const IndexPage = () => {
  return (
    <PageLayout>
      <>
        <SEOHomePage urlPath="/" />
        <main
          className='w-full h-full flex items-center justify-center'
        >
          <div className="w-full h-full">
            <span className='text-8xl text-center w-full block'>
              👨🏻‍💻
            </span>
            <h1 className='text-7xl mt-3 text-primary font-bold text-center'>Async Talk</h1>
            <h3 className=" text-primary text-center mt-10">我们的目标是把前端带向下一个高度</h3>

            <i className='text-xs block w-full text-center text-primary mt-3'> 施工中... </i>
          </div>
        </main>
      </>
    </PageLayout>
  )
}

export default IndexPage
