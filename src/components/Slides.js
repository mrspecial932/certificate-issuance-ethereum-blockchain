import React from 'react'
import { AiFillTwitterCircle } from "react-icons/ai";
import { DiGithubBadge } from "react-icons/di";
import { FaCodepen } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io";
import { BsArrowRightSquareFill } from "react-icons/bs";

export default function Slides() {
  return (
    <div className=' px-12 md:px-40 lg:px-52 '>
    <div className="flex  mb-6 gap-6 items-center">
   
    <BsArrowRightSquareFill className='text-6xl gap-3'  />
    <p>Issuance: When a certificate is issued, it is hashed and the hash is stored on the blockchain.</p>

   
    </div>
    <div className="flex  gap-6  mb-6 items-center ">
   
   <BsArrowRightSquareFill className='text-6xl gap-3'/>
   <p>Security: Blockchain ensures that the certificate data is tamper-proof and can be verified by anyone at any time.</p>

  
   </div>
   <div className="flex gap-6 items-center   mb-6">
   
   <BsArrowRightSquareFill className='text-6xl gap-3' />
   <p>Verification: To verify a certificate, the system hashes the certificate presented by the user and compares it with the hash stored on the blockchain.</p>

  
   </div>

</div>

  )
}
