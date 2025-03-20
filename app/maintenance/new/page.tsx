'use client'

import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('./maintenance-new'),
  { ssr: false }
)

const MainNewMaintenancePage = () => {
  return ( 
    <DynamicComponentWithNoSSR />
   );
}
 
export default MainNewMaintenancePage;