import React from 'react'
import { Helmet } from 'react-helmet'
import logo from '../../images/logo.png'
import MetaTwitterCard, { TwitterCardType } from './twitter-card'

type SEOHomePageProps = {
  urlPath: string
}

function SEOHomePage(props: SEOHomePageProps) {
  const url = `/${props.urlPath}`

  const metaTitle = 'async talk podcast'

  const logoLink = logo
  const desc = 'async talk podcast'
  return (
    <Helmet>
      <meta property="og:url" content={url} />
      <meta property="og:type" content='website' />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:image" content={logoLink} />
      <meta property="og:description" content={desc} />
      <meta property="og:site_name" content='AsyncTalk' />
      <meta property="article:author" content='async talk, AnnatarHe, Sleaf, Tinko, 小鹿' />

      <meta name='description' content={desc} />
      <meta name='keyword' content='async talk, podcast, web, react, vue' />

      <MetaTwitterCard
        card={TwitterCardType.summary}
        site='async talk'
        creator='async talk'
        url={url}
        title={metaTitle}
        description={desc}
        image={logoLink}
      />
    </Helmet>
  )
}

export default SEOHomePage