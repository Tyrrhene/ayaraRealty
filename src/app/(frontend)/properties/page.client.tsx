'use client'

import React, { useEffect } from 'react'

export default function PageClient() {
  useEffect(() => {
    console.log('✅ useEffect ran')
  }, [])

  console.log('✅ PageClient render')

  return <div>Hello from PageClient</div>
}
