import React from 'react'
import { authors } from '../constants'

type FooterProps = {
}

function Footer(props: FooterProps) {
  return (
    <footer className=' h-32 w-full flex justify-center items-center flex-col'>
      <h6 className=' text-xs text-center text-primary'>Async Talk</h6>
      <ul className=' text-xs text-primary flex w-full items-center justify-around mt-3'>
        {authors.map(x => (
          <li key={x.name}>
            {x.link ? (
              <a
               href={x.link ?? '#'}
                target='_blank'
                className='hover:underline'
                >
                {x.name}
              </a>
            ) : (
              <span>{x.name}</span>
            )}
          </li>
        ))}
      </ul>
    </footer>
  )
}

export default Footer