import React, { useMemo } from 'react'
import logo from '../images/logo.png'
import Footer from './footer'
import Header from './header'

type PageLayoutProps = {
  withoutBackgroundImage?: boolean
  children: React.ReactElement
}

function PageLayout(props: PageLayoutProps) {
  const containerCustomStyle = useMemo<React.CSSProperties>(() => {
    if (props.withoutBackgroundImage) {
      return {}
    }
    return {
      backgroundImage: `url(${logo})`
    }
  }, [props.withoutBackgroundImage])

  return (
    <div
      className='w-full h-full object-cover bg-center bg-no-repeat bg-cover min-h-screen'
      style={containerCustomStyle}
    >
      <div className='w-full h-full backdrop-blur-3xl'>
        <Header />
        <div
          className='w-full h-full container flex justify-center items-center mx-auto'
          style={{
            minHeight: 'var(--body-min-height)'
          }}
        >
          {props.children}
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default PageLayout
