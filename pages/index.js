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
      <meta property="og:title" content="Site Title" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="http://my.site.com" />
      <meta property="og:image" content="http://my.site.com/images/thumb.png" />
      <meta property="og:description" content="Site description" />
      <meta name="theme-color" content="#FF0000" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
        <DynamicComponentWithNoSSR />
  </div>
)

export default Home
