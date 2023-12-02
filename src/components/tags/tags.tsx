import React from 'react'

type TagsProps = {
  tags: string[]
}

function Tags(props: TagsProps) {
  return (
    <div className='flex flex-wrap'>
      {props.tags.map(x => (
        <div key={x} className='px-2 py-0.5 rounded-2xl duration-75 hover:bg-primary/10 transition-all cursor-pointer active:scale-95'>
          <span className='select-none'>{x}</span>
        </div>
      ))}
    </div>
  )
}

export default Tags