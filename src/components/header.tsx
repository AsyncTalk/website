import logo from '../images/logo.png'
import React from 'react'
import { Link } from 'gatsby'
import IconExternalLink from './icons/external-link'

type HeaderProps = {
}

const channels = [{
  link: 'https://podcasts.apple.com/cn/podcast/asynctalk-s01/id1590369272',
  title: 'Apple Podcast',
  icon: <div />
}, {
  link: 'https://www.xiaoyuzhoufm.com/podcast/61684ce4d8fa23fb00fc4d3a',
  title: '小宇宙',
  icon: <div />
  // }, {
  //   link: 'https://open.spotify.com/show/6AMzdZxcztIoKlZrGX79lX',
  //   title: 'Spotify',
  //   icon: <div />
}]

function Header(props: HeaderProps) {
  return (
    <header className='z-10 bg-neutral-900/40 w-full sticky top-0 backdrop-blur p-4'>
      <div className='whitespace-nowrap select-none max-w-screen-lg w-full flex justify-between items-center mx-auto'>
        <div className='flex justify-center items-center'>
          <Link
            to='/'
            className='flex justify-center items-center'
          >
            <img
              src={logo}
              alt='Async Talk'
              width={32}
              height={32}
            />
            <span
              className='text-white/70 ml-3 hover:text-white/90 duration-100 transition-colors'
            >Async Talk Podcast</span>
          </Link>
          <div className=' h-4 w-0.5 bg-white/50 mx-4' />
          <ul
            className='text-white/70 flex items-center justify-center'
          >
            {channels.map(x => (
              <li
                key={x.title}
                className='mr-2 last:mr-0 hover:text-white/90 duration-100 transition-colors'
              >
                <Link
                  to={x.link}
                  className='flex items-center justify-center'
                >
                  {x.title}
                  <IconExternalLink
                    className='scale-75 -translate-y-1'
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className='text-white/70 hover:text-white/90 duration-100 transition-colors'>
          <Link to='/posts'>Posts</Link>
        </div>
      </div>
    </header>
  )
}

export default Header