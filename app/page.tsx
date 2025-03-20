'use client'

import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('./dashboard'),
  { ssr: false }
)

const MainDashboardPage = () => {
  return ( 
    <DynamicComponentWithNoSSR />
   );
}
 
export default MainDashboardPage;