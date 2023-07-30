import React from 'react'

type KeyValueInfoProps = {
  title: string
  value: React.ReactElement
}

function KeyValueInfo(props: KeyValueInfoProps) {
  const { title, value } = props
  return (
    <div className='flex items-start justify-start mt-2'>
      <span className='mr-1 whitespace-nowrap'>{title}: </span>
      {value}
    </div>
  )
}

export default KeyValueInfo