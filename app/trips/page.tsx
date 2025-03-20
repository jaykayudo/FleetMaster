'use client'

import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('./trips-main'), { ssr: false })

const MainTripsPage = () => {
  return <DynamicComponentWithNoSSR />
}

export default MainTripsPage
