import React from 'react'
import { MarkdownElementProps } from './props'

function Img(props: MarkdownElementProps & { href?: string }) {
  return <img {...props} />
}

export default Img