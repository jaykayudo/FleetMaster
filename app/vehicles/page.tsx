'use client'

import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('./vehicle-main'),
  { ssr: false }
)

const MainVehiclePage = () => {
  return ( 
    <DynamicComponentWithNoSSR />
   );
}
 
export default MainVehiclePage;