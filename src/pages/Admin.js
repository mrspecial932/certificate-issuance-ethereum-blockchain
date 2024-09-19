import React from 'react'
import Form from "../components/Form"
import Table from "../components/Table"

export default function Admin({ certificateVerifier , onSubmit }) {
  return (
    <div className='py-10'>
      <Form certificateVerifier={certificateVerifier} onSubmit={onSubmit}></Form>
      <Table certificateVerifier={certificateVerifier}/>
    </div>
  )
}
