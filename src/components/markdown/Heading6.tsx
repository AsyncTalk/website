import React from 'react'
import { MarkdownElementProps } from './props'

function Heading6(props: MarkdownElementProps) {
  return (
    <h6>{props.children}</h6>
  )
}

export default Heading6