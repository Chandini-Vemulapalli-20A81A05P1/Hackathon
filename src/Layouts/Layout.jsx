import React from 'react'
import Footer from '../components/Header/Footer'
import Navbar from '../components/Header/Navbar'
import Routing from '../routes/Routing'
// import Footer from '../components/Footer'
const Layout = () => {

  return (
    <>
  
     <div>
     <Navbar />
    <div>
      <Routing />
    </div >
    <div className='h-100'>
    <Footer />
    </div>
  </div>
  
  </>
  )
}

export default Layout
