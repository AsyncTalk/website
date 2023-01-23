import React from 'react'
import { MarkdownElementProps } from './props'

function Heading4(props: MarkdownElementProps) {
  return (
    <h4>{props.children}</h4>
  )
}

export default Heading4