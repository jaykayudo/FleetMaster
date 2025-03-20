'use client'

import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('./trips-new'), { ssr: false })

const MainTripsNewPage = () => {
  return <DynamicComponentWithNoSSR />
}

export default MainTripsNewPage
