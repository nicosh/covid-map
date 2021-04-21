import React, { useState, useEffect, useContext } from 'react'
import * as THREE from 'three';
import { ThreeLayer, BaseObject } from 'maptalks.three/dist/maptalks.three.js'
import Circle from '../animations/circle'
import * as maptalks from 'maptalks';
import { AnimateMarkerLayer } from 'maptalks.animatemarker/dist/maptalks.animatemarker.js'

export const MapContext = React.createContext(null)

export function MapProvider({ children, ...rest }) {
    const [animating, setAnimating] = useState(false)
    const [prevLayer, setPrevLayer] = useState(false)
    const [index, setIndex] = useState(0)
    const [ThreeLayers, setThreeLayers] = useState([])
    const [canGoNext, setcanGoNext] = useState(true)

    const steps = [
        {
            cb: async (map) => {
                setAnimating(true)
                let data = await fetch("/api/china")
                let json = await data.json()
                let frame2 = await AddLayerbubbles(map,json)
                setPrevLayer(frame2)
                let frame = await moveTo(map, [114.295181, 30.583332])
                setAnimating(false)
            }
        },
        {
            cb: async (map) => {
                setAnimating(true)
                let frame = await changeView(map, [114.295181, 30.583332]);
                map.removeLayer(prevLayer)
                let frame2 = await addCircleInfo(map, [114.295181, 30.583332])
                setThreeLayers(ThreeLayers.concat(frame2))
                setAnimating(false)
            }
        },
        {
            cb: async (map) => {
                setAnimating(true)
                let data = await fetch("/api/eu2")
                let json = await data.json()
                let frame = await moveTo(map, [7.981400, 42.032974])
                let frame2 = await AddLayerbubbles(map,json)
                setPrevLayer(frame2)
                setAnimating(false)
            }
        },
        {
            cb: async (map) => {
                setAnimating(true)
                let data = await fetch("/api/italy")
                let json = await data.json()
                let frame = await changeView(map, [7.981400, 42.032974]);
                map.removeLayer(prevLayer)
                let frame2 = await AddBarsLayer(map, json);
                setThreeLayers(ThreeLayers.concat(frame2))
                setAnimating(false)
            }
        },
        {
            cb: async (map) => {
                return true
            }
        },
        {
            cb: async (map) => {
                setAnimating(true)
                let data = await fetch("/api/us")
                let json = await data.json()
                let frame = await changeView(map, [-98.538751, 38.272689],5);
                let frame2 = await AddBarsLayer(map, json,"t3",false);
                setThreeLayers(ThreeLayers.concat(frame2))
                setAnimating(false)
            }
        },
        {
            cb: async (map) => {
                return true
            }
        },
        {
            cb: async (map) => {
                setAnimating(true)
                let frame = await moveTo(map,  [-35.567045,37.718590],3)
                ThreeLayers.forEach(el => {
                    el.remove()
                })

                setAnimating(false)
            }
        },
        {
            cb: async (map) => {
                return true
            }
        },
        {
            cb: async (map) => {
                setAnimating(true)
                let frame = await changeView(map, [-1.698404,52.749594],6);
                setAnimating(false)
            }
        },
        {
            cb: async (map) => {
                return true
            }
        },
        {
            cb: async (map) => {
                setAnimating(true)
                let data = await fetch("/api/uk")
                let json = await data.json()
                let frame2 = await AddBarsLayer(map, json,"t4",true);
                setThreeLayers(ThreeLayers.concat(frame2))
                setAnimating(false)
            }
        },
        {
            cb: async (map) => {
                setAnimating(true)
                let frame = await moveTo(map,  [-35.567045,37.718590],3)
                let data = await fetch("/api/world")
                let json = await data.json()
                let frame2 = await AddLayerbubbles(map,json)
                ThreeLayers.forEach(el => {
                    el.remove()
                })
                setAnimating(false)
            }
        },
        {
            cb: async (map) => {
                return true
            }
        },
        {
            cb: async (map) => {
                setcanGoNext(false)
                return true
            }
        }
    ]
    const nextAnimation = (map) => {
        let fn = steps[index].cb
        fn(map)
        setIndex(index + 1)
    }
    // initi main map
    const initMap = (ref) => {
        const map = new maptalks.Map(ref, {
            center: [-0.113049, 51.498568],
            zoom: 4,
            draggable: false,        //disable drag
            dragPan: false,          //disable drag panning
            dragRotate: false,       //disable drag rotation
            dragPitch: false,        //disable drag pitch
            scrollWheelZoom: false,  //disable wheel zoom
            touchZoom: false,        //disable touchzoom
            doubleClickZoom: false,  //disable doubleclick zoom
            baseLayer: new maptalks.TileLayer('base', {
                urlTemplate: 'http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
                subdomains: ['a', 'b', 'c', 'd'],
            })
        });
        return map
    }

    // fly to a given point
    const moveTo = (map, center,zoom=4) => {
        return new Promise((resolve, reject) => {
            map.animateTo({
                center,
                zoom,
                pitch: 0,
                bearing: 20
            }, {
                duration: 5000
            }, (frame) => {
                if (frame.state.playState === 'finished') {
                    resolve("animation done")
                }
            }
            )
        })
    }

    // zoom-in and aniamte to a given point, also show the marker
    const changeView = (map, center,zoom=6) => {
        return new Promise((resolve, reject) => {
            map.animateTo({
                center,
                zoom,
                pitch: 65,
                bearing: 360
            }, {
                duration: 7000
            }, (frame) => {
                if (frame.state.playState === 'finished') {
                    resolve("animation done")
                }

            });
        })
    }

    const addCircleInfo = (map, center) => {
        return new Promise((resolve, reject) => {
            let threeLayer = new ThreeLayer('t', {
                forceRenderOnMoving: true,
                forceRenderOnRotating: true,
                animation: true
            });

            threeLayer.prepareToDraw = function (gl, scene, camera) {
                let light = new THREE.DirectionalLight(0xffffff);
                light.position.set(0, -10, 10).normalize();
                scene.add(light);
                addRingEffect();

            };

            threeLayer.prepareToDraw = function (gl, scene, camera) {
                let light = new THREE.DirectionalLight(0xffffff);
                light.position.set(0, -10, 10).normalize();
                scene.add(light);
                addCircles();
                threeLayer.config('animation', true);

            };
            threeLayer.addTo(map);
            function getMaterial(fontSize, text, fillColor) {
                let SIZE = 256;
                let canvas = document.createElement('canvas');
                canvas.width = canvas.height = SIZE;
                let ctx = canvas.getContext('2d');
                let gradient = ctx.createLinearGradient(0, 0, SIZE, 0);
                //gradient.addColorStop("0", "#ffffff");
                gradient.addColorStop("0.0", "#1a9bfc");
                //gradient.addColorStop("1.0", "#7049f0");
                // gradient.addColorStop("0.66", "white");
                // gradient.addColorStop("1.0", "red");

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 40;
                ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillStyle = fillColor;
                ctx.font = `${fontSize}px Aria`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, SIZE / 2, SIZE / 2);
                ctx.rect(0, 0, SIZE, SIZE);
                let texture = new THREE.Texture(canvas);
                texture.needsUpdate = true;

                let material = new THREE.MeshPhongMaterial({
                    map: texture,
                    // side: THREE.DoubleSide,
                    transparent: true
                });
                return material;
            }
            let circles;
            function addCircles() {
                let lnglats = [center];
                let text = "17238 cases"

                let material = getMaterial(40, text, '#fff');
                circles = lnglats.map(function (lnglat) {
                    let circle = new Circle(lnglat, {
                        radius: 400000
                    }, material, threeLayer);
                    return circle;
                });
                animateShow()
                threeLayer.addMesh(circles);
                resolve(threeLayer)
            }

            function animateShow() {
                circles.forEach(circle => {
                    circle.animateShow({
                        duration: 1000,
                        easing: 'upAndDown'
                    })
                });
            }

        })
    }




    const AddBarsLayer = (map,aggregated,layerName="t2",rev=true) => {
        return new Promise((resolve, reject) => {
            let threeLayer = new ThreeLayer(layerName, {
                forceRenderOnMoving: true,
                forceRenderOnRotating: true
                // animation: true
            });
            threeLayer.prepareToDraw = function (gl, scene, camera) {

                var light = new THREE.DirectionalLight(0xffffff);
                light.position.set(0, -10, 10).normalize();
                scene.add(light);
                scene.add(new THREE.AmbientLight(0xffffff, 0.5));
                setTimeout(() => {
                    addBars(scene);
                }, 1000);

            };
            threeLayer.addTo(map);
            var bars;
            var material = new THREE.MeshLambertMaterial({ color: '#c53e3e', transparent: true });
            var highlightmaterial = new THREE.MeshBasicMaterial({ color: 'yellow', transparent: true });
            function addBars(scene) {
                const time = 'time';
                const json = aggregated
                bars = json.filter(function (dataItem) {
                    return dataItem[2] > 0;
                }).slice(0, Infinity).map(function (dataItem) {
                    let coords = dataItem.slice(0, 2)
                    if(rev){
                        coords.reverse()

                    }
                    return {
                        coordinate: coords,
                        height: dataItem[2]
                    }
                }).map(function (d) {
                    var bar = threeLayer.toBox(d.coordinate, {
                        height: d.height * 200,
                        radius: 15000,
                        topColor: '#fff',
                        // radialSegments: 4
                    }, material);

                    // // tooltip test
                    // bar.setToolTip(d.height * 400, {
                    //     showTimeout: 0,
                    //     eventsPropagation: true,
                    //     dx: 10
                    // });


                    // //infowindow test
                    // bar.setInfoWindow({
                    //     content: 'hello world,height:' + d.height * 400,
                    //     title: 'message',
                    //     animationDuration: 0,
                    //     autoOpenOn: false
                    // });


    

                    return bar;
                });

                // bars.forEach(function (bar) {
                //     scene.add(bar.getObject3d());
                // });
                // threeLayer.renderScene();
                threeLayer.addMesh(bars);
                animateShow()
                animation();
                resolve(threeLayer)

            }

            function animation() {
                // layer animation support Skipping frames
                threeLayer._needsUpdate = !threeLayer._needsUpdate;
                if (threeLayer._needsUpdate && !map.isInteracting()) {
                    threeLayer.renderScene();
                }
                requestAnimationFrame(animation);
            }
            function animateShow() {
                bars.forEach(function (mesh) {
                    mesh.animateShow({
                        duration: 3000
                    });
                });
            }
        })
    }

    const AddLayerbubbles = (map,geo) => {
        return new Promise((resolve, reject) => {
            const getGradient = (colors) => {
                return {
                    type: 'radial',
                    colorStops: [
                        [0.70, 'rgba(' + colors.join() + ', 0.5)'],
                        [0.30, 'rgba(' + colors.join() + ', 1)'],
                        [0.20, 'rgba(' + colors.join() + ', 1)'],
                        [0.00, 'rgba(' + colors.join() + ', 0)']
                    ]
                };
            }
            const geometries = maptalks.GeoJSON.toGeometry(geo);
            const layer = new AnimateMarkerLayer(
                'animatemarker',
                geometries,
                {
                    'animation': 'scale,fade',
                    'randomAnimation': true,
                    'geometryEvents': false
                }
            )
                .setStyle([
                    {
                        filter: ['<=', 'mag', 9 ],
                        symbol: {
                            'markerType': 'ellipse',
                            'markerLineWidth': 0,
                            'markerFill': getGradient([135, 196, 240]),
                            'markerFillOpacity': 0.8,
                            'markerWidth': 15,
                            'markerHeight': 15
                        }
                    },
                    {
                        filter: ['<=', 'mag', 11],
                        symbol: {
                            'markerType': 'ellipse',
                            'markerLineWidth': 0,
                            'markerFill': getGradient([255, 255, 0]),
                            'markerFillOpacity': 0.8,
                            'markerWidth': 22,
                            'markerHeight': 22
                        }
                    },
                    {
                        filter: ['>', 'mag', 11],
                        symbol: {
                            'markerType': 'ellipse',
                            'markerLineWidth': 0,
                            'markerFill': getGradient([216, 115, 149]),
                            'markerFillOpacity': 0.8,
                            'markerWidth': 30,
                            'markerHeight': 30
                        }
                    }
                ])
                .addTo(map);
            resolve(layer)

        })
    }

    const options = {
        initMap,
        moveTo,
        changeView,
        AddLayerbubbles,
        animating,
        nextAnimation,
        canGoNext,
        index
    }


    return (
        <MapContext.Provider value={options}>
            {children}
        </MapContext.Provider>
    )
}

export function useMap() {
    const value = useContext(MapContext)
    return value
}