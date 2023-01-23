import React from 'react'
import { MarkdownElementProps } from './props'

function Heading2(props: MarkdownElementProps) {
  return (
    <h2 className='mt-6 text-2xl'>{props.children}</h2>
  )
}

export default Heading2