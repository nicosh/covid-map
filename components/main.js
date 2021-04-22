import react, { useEffect, useState, useRef } from 'react'
import styles from './Main.module.css'
import { useMap } from './providers/mapProvider'
import layers from '../components/layers/layers'
import ProgressBar from './progressbar'
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
        if(!animating && canGoNext ){
            nextAnimation(map)
        }
    }

    const layer = layers[index]
    let btnName = index == 0 ? "Start" : "Next"
    let perc = parseInt((index*100)/  (layers.length-1))
    let btnClassName = !animating && canGoNext ? "button" : "disabled"
    return (
        <div className={styles.map}>
            {!animating &&  layer}
            <div onKeyDown={(e) => { handleChange(e) }} className={styles.map} id="map" ref={section}></div>
                <div className={styles.controls}>
                    <div className={styles.control_right}>
                    <a onClick={(e) => { handleNext(e) }} href="#" className={styles[btnClassName]}> {btnName} </a> 
                        <ProgressBar percentage={perc} />
                    </div>
                </div>
            
        </div>

    )
}

export default Main