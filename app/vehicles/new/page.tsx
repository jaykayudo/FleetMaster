'use client'

import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('./vehicle-new'),
  { ssr: false }
)

const MainVehicleNewPage = () => {
  return ( 
    <DynamicComponentWithNoSSR />
   );
}
 
export default MainVehicleNewPage;