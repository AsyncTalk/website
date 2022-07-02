import React, { useMemo } from 'react'
import Footer from './footer'
import Header from './header'

type PageLayoutProps = {
  children: React.ReactElement
}

function PageLayout(props: PageLayoutProps) {

  return (
    <div className='flex flex-col h-full'>
      <Header />
      <main className='p-4'>
        {props.children}
      </main>
      <Footer />
    </div>
  )
}

export default PageLayout
