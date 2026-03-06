import { Alert } from 'flowbite-react'
import React from 'react'

export default function AppAlert({color,content}) {
  return <>
   <Alert color={color} className='my-2 p-2 flex items-center justify-center font-bold text-[17px]'>
      <span className="font-medium">{content}</span>
    </Alert>
  </>
}
