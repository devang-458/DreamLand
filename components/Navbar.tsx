import { Box } from 'lucide-react'
import React from 'react'
import { Button } from './ui/Button'

const Navbar = () => {
  const isSignedIn = false;
  const username = 'devang';
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
          {isSignedIn ? (<>
            <span className='greeting'>
              {username ? `Hi, ${username}` : 'Signed In'}
            </span>
            <Button size='sm' onClick={handleAuthClick}
              className='cta'>
              Log Out
            </Button>

          </>) : (
            <>
              <Button
                onClick={handleAuthClick}
                className='login'
                size='sm' variant='ghost'>
                Log In
              </Button>
              <a
                className='cta'
                href="#upload">
                Get Started
              </a>
            </>
          )}

        </div>
      </nav >
    </header >
  )
}


export default Navbar