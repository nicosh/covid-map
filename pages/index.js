import React from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/main'),
  { ssr: false }
)
const Home = () => (
  <div>
    <Head>
      <title>Covid-19 timeline map</title>
      <meta name="description" content="Interactive covid-19 timeline map" />
      <meta property="og:title" content="Interactive covid-19 timeline map" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://covid19.czzncl.dev/" />
      <meta property="og:image" content="https://covid19.czzncl.dev/screen.png" />
      <meta property="og:description" content="Interactive covid-19 timeline map" />
    </Head>
        <DynamicComponentWithNoSSR />
  </div>
)

export default Home
