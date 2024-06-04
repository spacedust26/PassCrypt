import React from 'react'

const Footer = () => {
  return (
    <div className='bg-purple-950 text-white flex flex-col justify-center items-center w-full fixed bottom-0'>
      <div className="logo font-bold text-2xl">
        <span className='text-purple-300'>P</span>
        <span>ass</span>
        <span className='text-purple-300'>C</span>
        <span>rypt</span>
      </div>
      <div className="flex justify-center items-center">Created with <lord-icon
        src="https://cdn.lordicon.com/ohfmmfhn.json"
        trigger="hover">
      </lord-icon>
      by Pranamya</div>
    </div>
  )
}

export default Footer
