import { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import HeroSection from './components/HeroSection'
import MyToastConntainer from './components/MyToastConntainer'
import FriendsRequestSection from './components/FriendsRequestSection'

function App() {

  return (
    <>
      <MyToastConntainer />
      <Navbar />
      <div className='flex relative'>
        <Sidebar />
        <HeroSection />
        <FriendsRequestSection />
      </div>
    </>

  )
}

export default App
