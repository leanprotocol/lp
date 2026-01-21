import Footer from '@/components/footer'
import GetStartedPage from '@/components/get-started/get-started-page'
import { Header } from '@/components/header'
import React from 'react'

const page = () => {
  return (
    <div>
        <Header/>
        <GetStartedPage/>
        <Footer/>
    </div>
  )
}

export default page