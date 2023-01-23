import React from 'react'
import { MarkdownElementProps } from './props'

function Heading5(props: MarkdownElementProps) {
  return (
    <h5>{props.children}</h5>
  )
}

export default Heading5