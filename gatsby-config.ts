import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  siteMetadata: {
    title: 'Async Talk Podcast',
    siteUrl: `https://asynctalk.com`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
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
      resolve: 'gatsby-plugin-favicons',
      options: {
        logo: './src/images/logo.png',
        appName: 'Async Talk Podcast',
        background: '#fff',
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          yandex: false,
          windows: false
        }
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
        path: `${__dirname}/src/posts`,
        slugify: ['/ppps']
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        defaultLayouts: {
          // posts: require.resolve("./src/components/layout.tsx"),
          // default: require.resolve("./src/components/layout.tsx"),
        },
      }
    },
    {
      resolve: `gatsby-plugin-podcast-feed-mdx`,
      options: {
        title: 'Async Talk',
        subtitle: 'Async Talk',
        description: 'Async Talk',
        summary: `Async Talk`,
        podcastType: `episodic`,
        siteUrl: `https://asynctalk.com`,
        imageUrl: `https://podcast.com/podcast-image/png`,
        feedUrl: `https://asynctalk.com/pocast-rss-feed.xml`,
        language: 'zhCN',
        copyright: `Copyright © 2022 Async Talk`,
        authorName: `The Author`,
        ownerName: `The Owner`,
        ownerEmail: 'async.talk@gmail.com',
        managingEditor: 'async.talk@gmail.com',
        webMaster: 'async.talk@gmail.com',
        explicit: `no`,
        publicationDate: `Jan 25, 2021 10:00:00 GMT`,
        category1: `Arts`,
        subCategory1: `Books`,
        category2: `Education`,
        subCategory2: `Courses`,
        category3: `Business`,
        subCategory3: `Marketing`,
        timeToLive: `60`,
        outputPath: `/podcast-rss-feed.xml`
      },
    },
  ],
}

export default config
