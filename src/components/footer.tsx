import React from 'react'
import { authors } from '../constants'

type FooterProps = {
}

function Footer(props: FooterProps) {
  return (
    <footer className='bg-black p-4 w-full flex justify-center items-center flex-col sticky bottom-0 left-0'>
      <ul className='max-w-screen-lg w-full text-xs text-primary/90 flex items-center justify-evenly'>
        {authors.map(x => {
          const nameNode = <span className='p-4'>{x.name}</span>;
          return (
            <li key={x.name}>
              {x.link
                ? <a
                  href={x.link}
                  target='_blank'
                  className='hover:underline'
                >
                  {nameNode}
                </a>
                : nameNode
              }
            </li>
          )
        })}
      </ul>
    </footer>
  )
}

export default Footer