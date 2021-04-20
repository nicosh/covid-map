import React from 'react'
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/main'),
  { ssr: false }
)
const Home = () => (
    <DynamicComponentWithNoSSR />
)

export default Home
