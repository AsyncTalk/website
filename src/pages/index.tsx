import * as React from "react"
import { Helmet } from "react-helmet"
import PageLayout from "../components/layout"
import SEOTags from "../components/seo/seo-tags"

// markup
const IndexPage = () => {
  return (
    <PageLayout>
      <>
        <SEOTags
          title='Async Talk'
          desc='AsyncTalk 是一档中文，面向对 web 开发感兴趣的朋友所录制的 Podcast 节目。 后续我们会讨论更多更为前沿，工程化的话题，感兴趣可以持续关注。 联系我们请发邮件至 async.talk@gmail.com 期待沟通。'
          urlPath="/"
        />
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
