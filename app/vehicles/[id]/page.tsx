'use client'

import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('./vehicle-details'), { ssr: false })

const MainVehicleDetailsPage = () => {
  return <DynamicComponentWithNoSSR />
}

export default MainVehicleDetailsPage
