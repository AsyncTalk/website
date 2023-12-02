import React from 'react'
import { Helmet } from 'react-helmet'
import logo from '../../images/logo.png'
import { TwitterCardType } from './twitter-card'

type SEOHomePageProps = {
  title: string
  desc: string
  urlPath: string
  keywords?: readonly string[]
}

function SEOTags(props: SEOHomePageProps) {
  const { title, desc, urlPath, keywords = [] } = props
  const url = `https://asynctalk.com${urlPath}`

  const metaTitle = title + ' | AsyncTalk podcast'

  const logoLink = logo

  const metaKeywords = [
    'AsyncTalk',
    'podcast',
    'web',
    'frontend',
    ...keywords
  ]

  return (
    <Helmet>
      <meta property="og:url" content={url} />
      <meta property="og:type" content='website' />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:image" content={logoLink} />
      <meta property="og:description" content={desc} />
      <meta property="og:site_name" content='AsyncTalk' />
      <meta property="article:author" content='AsyncTalk, AnnatarHe, Sleaf, Tinko, 小鹿' />

      <meta name='description' content={desc} />
      <meta name='keyword' content={metaKeywords.join(', ')} />
      <title>{props.title}</title>

      <meta name="twitter:card" content={TwitterCardType.summary} />
      {/* <meta name="twitter:site" content={'@asynctalk'} /> */}
      {/* <meta name="twitter:creator" content={`@asynctalk`} /> */}
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={logoLink} />
      <meta name="twitter:image:alt" content={metaTitle} />
    </Helmet>
  )
}

export default SEOTags