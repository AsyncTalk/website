import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  siteMetadata: {
    title: 'Async Talk Podcast',
    siteUrl: `https://asynctalk.com`,
  },
  graphqlTypegen: true,
  plugins: [
    'gatsby-plugin-sitemap',
    'gatsby-plugin-postcss',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-cloudflare-web-analytics',
      options: {
        token: '05d831013555490bbd9ab4afb8543e00'
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: `AsyncTalk`,
        short_name: `AsyncTalk`,
        start_url: `/`,
        background_color: `#000000`,
        theme_color: `#2EB8B8`,
        display: `standalone`,
        icon: './src/images/logo.png',
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/src/posts/`,
      },
    },
    {
      resolve: "gatsby-plugin-page-creator",
      options: {
        path: `${__dirname}/src/posts`
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
    },
    {
      resolve: `gatsby-plugin-podcast-feed-mdx`,
      options: {
        title: 'Async Talk',
        subtitle: '我们的目标是把前端带向下一个高度',
        description: `AsyncTalk 是一档中文，面向对 web 开发感兴趣的朋友所录制的 Podcast 节目。
后续我们会讨论更多更为前沿，工程化的话题，感兴趣可以持续关注。
联系我们请发邮件至 async.talk@gmail.com 期待沟通。`,
        summary: `AsyncTalk 是一档中文，面向对 web 开发感兴趣的朋友所录制的 Podcast 节目。
后续我们会讨论更多更为前沿，工程化的话题，感兴趣可以持续关注。
联系我们请发邮件至 async.talk@gmail.com 期待沟通。
`,
        podcastType: `episodic`,
        siteUrl: `https://asynctalk.com`,
        imageUrl: `https://podcast.com/podcast-image/png`,
        feedUrl: `https://asynctalk.com/pocast-rss-feed.xml`,
        language: 'zhCN',
        copyright: `Copyright © 2022 Async Talk`,
        authorName: 'AsyncTalk',
        ownerName: 'Async Talk',
        ownerEmail: 'async.talk@gmail.com',
        managingEditor: 'async.talk@gmail.com',
        webMaster: 'async.talk@gmail.com',
        explicit: `no`,
        publicationDate: `Oct 21, 2021 10:00:00 GMT`,
        category1: `technology`,
        timeToLive: `60`,
        outputPath: `/podcast-rss-feed.xml`
      },
    },
  ],
}

export default config
