import React, { useEffect } from 'react';

import Nav from "../components/core/Nav"
import MainSection from '../components/landing/MainSection.js';
import QuoteSection from '../components/landing/QuoteSection.js';
export default function LandingPage() {
  return (
    <>
     <div className='main'>
          <div className='gradient' />
      </div>
      <Nav isLandingPage={true} />
      <MainSection />
      {/* <QuoteSection /> */}
    </>
  )
}
