
import dynamic from 'next/dynamic'
import '../public/grid.css'
import 'animate.css/animate.css'
import '../public/style.css'

const MapProvider = dynamic(
  () => import('../components/providers/mapProvider').then((mod) => mod.MapProvider),
  { ssr: false }
)
function MyApp({ Component, pageProps }) {
    return (
            <MapProvider>
                <Component {...pageProps} />
            </MapProvider>
    )
}

export default MyApp