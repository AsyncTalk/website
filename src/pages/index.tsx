import * as React from "react"
import BgImg from '../images/bg-fm.png'
import PageLayout from "../components/layout"
import SEOTags from "../components/seo/seo-tags"
import TitleImage from "../images/title.png"

// markup
const IndexPage = () => {
  return (
    <PageLayout>
      <>
        <SEOTags
          title='Async Talk'
          desc='AsyncTalk 是一档面向对 web 开发感兴趣的朋友所录制的中文 Podcast 节目。 后续我们会讨论更多更为前沿，工程化的话题，感兴趣可以持续关注。 联系我们请发邮件至 async.talk@gmail.com 期待沟通。'
          urlPath="/"
        />
        <div
          className="h-[75vh] min-h-[250px] m-auto max-w-screen-lg bg-black bg-[center_top_30%] bg-no-repeat sm:bg-[length:auto_50%] bg-[length:95%_auto]"
          style={{
            backgroundImage: `url(${BgImg})`,
          }}
        >
          <div className="h-full backdrop-blur-md">
            <div className="h-full select-none -translate-y-1/4 flex flex-col justify-center max-w-[50%] m-auto">
              <img draggable={false} className='text-center' src={TitleImage} title='async-talk' />
              <h3 className="text-white mt-10 italic text-right w-full">把前端带向下一个高度</h3>
            </div>
          </div>
        </div>
      </>
    </PageLayout>
  )
}

export default IndexPage
