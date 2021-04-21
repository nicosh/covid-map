import react, { useEffect, useState, useRef } from 'react'
import styles from './Main.module.css'
import { useMap } from './providers/mapProvider'
import layers from '../components/layers/layers'
const Main = () => {
    const { initMap, canGoNext, animating, nextAnimation,index } = useMap()
    const section = useRef();
    const [map, setMap] = useState(false)

    useEffect(() => {
        let map = initMap(section.current)
        setMap(map)

        return () => {
            map.remove()
        }
    }, [])

    const handleChange = (e) => {
        let keyCode = e.keyCode
        console.log(keyCode)
    }
    const handleNext = (e) => {
        e.preventDefault()
        nextAnimation(map)
    }

    const layer = layers[index]
    let btnName = index == 0 ? "Start" : "Next"
    return (
        <div className={styles.map}>
            {!animating &&  layer}
            <div onKeyDown={(e) => { handleChange(e) }} className={styles.map} id="map" ref={section}></div>
            {!animating && canGoNext &&
                <div className={styles.controls}>
                    <div className={styles.control_right}>
                        <a onClick={(e) => { handleNext(e) }} href="#" className={styles.button}> {btnName} </a>
                    </div>
                </div>
            }
        </div>

    )
}

export default Main