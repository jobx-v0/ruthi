import React from 'react';

const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="relative flex justify-center items-center">
      {/* Outer spinning gradient circle */}
      <div className="absolute animate-spin-slow rounded-full h-40 w-40 bg-gradient-to-r from-orange-500 to-purple-500 opacity-75"></div>
      
      {/* Inner pulsing circle */}
      <div className="absolute animate-pulse rounded-full h-28 w-28 bg-gradient-to-r from-purple-500 to-pink-500"></div>

      {/* Inner glowing dot */}
      <div className="absolute rounded-full h-6 w-6 bg-orange-500 animate-ping"></div>
    </div>
  </div>
);

export default Loader;
