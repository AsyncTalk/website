import React from 'react'

export enum TwitterCardType {
  summary = 'summary'
}

type MetaTwitterCardProps = {
  card: TwitterCardType
  site: string
  creator: string
  url: string
  title: string
  image: string
  description: string
}
