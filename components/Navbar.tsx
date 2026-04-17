import { Box } from 'lucide-react'
import React from 'react'

const Navbar = () => {
  const handleAuthClick = () => {

  }
  return (
    <header className='navbar'>
      <nav className='inner'>
        <div className='left'>
          <div className='brand'>
            <Box className='logo' />
            <span className='name'>DreamLand</span>
          </div>
          <ul className='links'>
            <a href='#'>Product</a>
            <a href='#'>Pricing</a>
            <a href='#'>Community</a>
            <a href='#'>Enterprise</a>
          </ul>
        </div>
        <div className='actions'>
          <button
            onClick={handleAuthClick}
            className='login'>
            Login
          </button>
          <a
            className='cta'
            href="#upload">
            Get Started
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Navbar