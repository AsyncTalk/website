import { Script } from 'gatsby'
import React from 'react'
import { Helmet } from 'react-helmet'

type PageLayoutProps = {
  children: React.ReactElement
}

function PageLayout(props: PageLayoutProps) {
  return (
    <div>
      {props.children}
    </div>
  )
}

export default PageLayout
