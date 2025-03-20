'use client'

import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('./maintenance-main'),
  { ssr: false }
)

const MainMaintenancePage = () => {
  return ( 
    <DynamicComponentWithNoSSR />
   );
}
 
export default MainMaintenancePage;