import React from 'react'
import Slide from "../components/Slides"
export default function Home() {

  const boxstyle= ' rounded-3xl p-px bg-gradient-to-b from-green-300 to-green-300 dark:from-green-200 dark:to-purple-800 m-4'
  const glow='rounded-[calc(1.5rem-1px)] p-10 bg-white dark:bg-gray-900'
  return (
    <>
    <div className='w-full lg:pt-60 md:px-40 px-4   sm:px-20 lg:px-36 grid  lg:grid-cols-2 md:grid-cols-1    '>
    <div className='col-span-1  w-full lg:pl-10 md:w-[100%] md:mt-8  md:px-5-[unset]  '>
    <h1 className=' lg:text-left text-center text-lg text-[#13ec36] lg:pt-0 pt-32'> Welcome to Blockchain</h1>
    <h1 className='flex text-center lg:text-left text-7xl font-extrabold  md:py-1  text-slate-100'>Certificate Verification System </h1>
   
    <p  className= 'text-lg text-center lg:text-left flex text-slate-100 mt-5 md:pr-0 pr-2 '> we create an open standard for issuing and verifying credentials on the Etherum BlockChain</p>

    <div className='mt-5 text-center lg:text-left '>
      
    <button className='ring-2 ring-[#13ec36] p-2 rounded-md  text-slate-50 hover:bg-[#13ec36] '> Verify Result</button>
    </div>
    </div>
    <div className='col-span-1 inset-0'>
    <img src={require('./../img/main.png')} className=' h-[500px] md:h-[600px] object-cover transition duration-300  '/>
    </div>
    </div>
    

    <div className='  to-slate-900   px-0 md:px-12 w-full'>
    <div className='place-items-center min-h-screen ' >
     <div  className={`${boxstyle}`}>   
    <h1   className={`${glow}`}  > <span className= "text-2xl"> Our unique features</span>  </h1>
    </div>
          <p className= 'font-medium mb-4 px-8 py-10 '>
          Provide a project that allow you to verfiy without the third parties. the data stored in the block cannot be altered of deleted
          </p>

    <div className='grid grid-cols-1 lg:grid-cols-3  px-10 '>
    
  
          <div className={`${boxstyle}`}>
            <div className={`${glow}`}>           
               <h1 className=" text-[20px] font-bold"> Secure</h1>
            <p> Blockchain's decentralized and cryptographic nature ensures high security</p>
            </div>

        </div>
  
        <div className={`${boxstyle}`}>
        <div className={`${glow}`}>   
            <h1 className=" text-[20px] font-bold"> Transparent </h1>
            <p> All transactions are recorded publicly allowing for real-time tracking and verification</p>
        </div>
        </div>

        <div className={`${boxstyle}`}>
        <div className={`${glow}`}>   
            <h1 className=" text-[20px] font-bold"> Tamperproof </h1>
            <p> Data is protected from unauthorized changes or modifications, ensuring its integrity and authenticity</p>
        </div>
        </div>

        <div className={`${boxstyle}`}>
        <div className={`${glow}`}>   
            <h1 className=" text-[20px] font-bold"> Autonomous </h1>
            <p> Smart contract can execute authomatically when conditions are met </p>
        </div>
        </div>
      

  </div>
  </div>
  </div>

  <div className='suppoer  text-center bg-neutral-900 py-16'>
    <h1 className='text-[40px] font-[600] p-6 r'>how to use our service</h1>

      <Slide/>

  </div>
    </>

  )
}
   