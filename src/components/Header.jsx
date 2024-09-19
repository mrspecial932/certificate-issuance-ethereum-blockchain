import React, { useState } from 'react'
import {Link, link} from "react-router-dom"

export default function Header({account,setAccount}) {
  const connectHandler = async ()=>{
    const accounts=  await window.ethereum.request({method: 'eth_requestAccounts'});
    setAccount(accounts[0])
    console.log(accounts)

  }

  return (
    <header className='bg-slate-800 bg-opacity-30 backdrop-filter backdrop-blur-lg fixed w-full px-[30px] lg:px-[100px]
    z-30 h-[60px] lg:h-[70px] flex items-center mx-auto border-r-slate-700 opacity-1 '>
        <div className='flex flex-row lg:flex-row lg:items-center w-full justify-between'>

        <Link>
        <h1 className='font-semibold text-2xl text-slate-100'><span className='text-[#13ec36]'>Block</span>Certificate</h1>
        </Link>

          <nav className='hidden md:flex lg:flex gap-x-12'>
            <Link to ={"/"} className='text-[#fff] hover:text-purple-600'>Home</Link>
            <Link to ={"/verify"} className='text-[#fff] hover:text-purple-600'>Verfiy</Link>
            <Link to ={"/admin"} className='text-[#fff] hover:text-purple-600'>Admin</Link>
          </nav>  


          <div className='items-end ' >
            {account ? (
              <button className='ring-2 ring-[#13ec36] p-2 rounded-md  text-slate-50 hover:bg-[#13ec36] '>
                {account.slice(0 , 6) + '...' + account.slice(38,42)}
              </button>
          
            ):(
              <button className='ring-2 ring-[#13ec36] p-2 rounded-md  text-slate-50 hover:bg-[#13ec36] ' onClick={connectHandler}> 
                Connect
              </button>
          
            )
              
            }
        
          </div>
      
        </div>
        
    </header>  
  )
}
