import React from 'react'
import { MarkdownElementProps } from './props'

function Hr(props: MarkdownElementProps) {
  return (
    <hr className='my-8 border-primary'>{props.children}</hr>
  )
}

export default Hr