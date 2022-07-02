import React from 'react'
import { Helmet } from 'react-helmet'
import logo from '../../images/logo.png'
import MetaTwitterCard, { TwitterCardType } from './twitter-card'

type SEOHomePageProps = {
  title: string
  desc: string
  urlPath: string
}

function SEOTags(props: SEOHomePageProps) {
  const url = `/${props.urlPath}`

  const metaTitle = props.title + ' | async talk podcast'

  const logoLink = logo
  const desc = props.desc
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
      <title>{props.title}</title>

      <MetaTwitterCard
        card={TwitterCardType.summary}
        site='AsyncTalk'
        creator='AsyncTalk'
        url={url}
        title={metaTitle}
        description={desc}
        image={logoLink}
      />
    </Helmet>
  )
}

export default SEOTags