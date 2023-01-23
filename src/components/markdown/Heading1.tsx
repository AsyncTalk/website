import React from 'react'
import { MarkdownElementProps } from './props'

function Heading1(props: MarkdownElementProps) {
  return (
    <h1 className='mt-8 text-3xl'>{props.children}</h1>
  )
}

export default Heading1