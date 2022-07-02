import logo from '../images/logo.png'
import React from 'react'
import { Link } from 'gatsby'

type HeaderProps = {
}

function Header(props: HeaderProps) {
  return (
    <header className='z-10 bg-neutral-900/40 w-full sticky top-0 backdrop-blur p-4'>
      <div className='whitespace-nowrap select-none max-w-screen-lg w-full flex justify-between items-center mx-auto'>
        <Link
          to='/'
          className='flex justify-center items-center'>
          <img
            src={logo}
            alt='Async Talk'
            width={32}
            height={32}
          />
          <span className='text-white/70 ml-3'>Async Talk Podcast</span>
        </Link>
        <div className='text-white/70'>
          <Link to='/posts'>Posts</Link>
        </div>
      </div>
    </header>
  )
}

export default Header