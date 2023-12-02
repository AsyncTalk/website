import React from 'react'
import { MarkdownElementProps } from './props'

function Heading3(props: MarkdownElementProps) {
  return (
    <h3 className='mt-4 mb-1 text-xl'>{props.children}</h3>
  )
}

export default Heading3