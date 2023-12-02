import React from 'react'
import { MarkdownElementProps } from './props'
import IconExternalLink from '../icons/external-link'

function A(props: MarkdownElementProps & { href?: string }) {
  const { children, href = '' } = props
  const isExternalLink = href.startsWith('http')
  return (
    <div className='inline-flex'>
      <a
        className='transition-all active:scale-95 duration-75 p-1 rounded-lg leading-none hover:bg-primary/20 no-underline inline-block'
        href={href}
        target='_blank'
        rel='noopener noreferrer'
      >
        {children}
      </a>
      {isExternalLink && <IconExternalLink className='scale-50 -translate-y-2 -translate-x-1 -mr-2' />}
    </div>
  )
}

export default A