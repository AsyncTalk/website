import logo from '../images/logo.png'
import React from 'react'
import { Link } from 'gatsby'

type HeaderProps = {
}

function Header(props: HeaderProps) {
  return (
    <header className='w-full sticky backdrop-blur-3xl'>
      <div className='container flex justify-around items-center mx-auto'>
        <Link
          to='/'
          className='flex justify-center items-center'>
          <img
            src={logo}
            // src='../images/logo.png'
            alt='async talk logo'
            width={64}
            height={64}
          />
          <span className=' text-primary ml-3'>Async Talk Podcast</span>
        </Link>
        <div className='text-primary'>
          <Link to='/posts'>Posts</Link>
        </div>
      </div>
    </header>
  )
}

export default Header