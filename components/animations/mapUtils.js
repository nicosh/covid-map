import * as THREE from 'three';
import { ThreeLayer, BaseObject } from 'maptalks.three/dist/maptalks.three.js'
import Circle from './circle'
import * as maptalks from 'maptalks';
import geo from '../../data/geo/china'
import {AnimateMarkerLayer} from 'maptalks.animatemarker/dist/maptalks.animatemarker.js'
// initi main map
export function initMap(ref){
    const map = new maptalks.Map(ref, {
        center: [-0.113049, 51.498568],
        zoom: 14,
        draggable : false,        //disable drag
        dragPan : false,          //disable drag panning
        dragRotate : false,       //disable drag rotation
        dragPitch : false,        //disable drag pitch
        scrollWheelZoom : false,  //disable wheel zoom
        touchZoom : false,        //disable touchzoom
        doubleClickZoom : false,  //disable doubleclick zoom
        baseLayer: new maptalks.TileLayer('base', {
            urlTemplate: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png',
            subdomains: ['a', 'b', 'c', 'd'],
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        })
    });
    return map
}


// fly to a given point
export function moveTo(map,center){
    return new Promise((resolve, reject) => { 
        map.animateTo({
            center,
            zoom: 4,
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
export function changeView(map,center) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            map.animateTo({
                center,
                zoom: 6,
                pitch: 65,
                bearing: 360
            }, {
                duration: 7000
            }, (frame) => {
                if (frame.state.playState === 'finished') {
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
                        let text = Math.round(Math.random() * 10000);
                        let material = getMaterial(70, text, '#fff');
                        circles = lnglats.map(function (lnglat) {
                            let circle = new Circle(lnglat, {
                                radius: 400000
                            }, material, threeLayer);
                            return circle;
                        });
                        animateShow()
                        threeLayer.addMesh(circles);
                        resolve("animation done")
                    }

                    function animateShow() {
                        circles.forEach(circle => {
                            circle.animateShow({
                                duration: 1000,
                                easing: 'upAndDown'
                            })
                        });
                    }
                }

            });

        }, 7000);
    })
}


export function AddLayerbubbles(map) { 
    return new Promise((resolve, reject) => {
        const getGradient = (colors) => {
            return {
                type : 'radial',
                colorStops : [
                  [0.70, 'rgba(' + colors.join() + ', 0.5)'],
                  [0.30, 'rgba(' + colors.join() + ', 1)'],
                  [0.20, 'rgba(' + colors.join() + ', 1)'],
                  [0.00 , 'rgba(' + colors.join() + ', 0)']
                ]
            };
        }
        const geometries = maptalks.GeoJSON.toGeometry(geo);
        const layer = new AnimateMarkerLayer(
            'animatemarker',
            geometries,
            {
                'animation' : 'scale,fade',
                'randomAnimation' : true,
                'geometryEvents' : false
            }
        )
        .setStyle([
            {
                filter : ['<=', 'mag', 2],
                symbol : {
                    'markerType' : 'ellipse',
                    'markerLineWidth' : 0,
                    'markerFill' : getGradient([135, 196, 240]),
                    'markerFillOpacity' : 0.8,
                    'markerWidth' : 5,
                    'markerHeight' : 5
                }
            },
            {
                filter : ['<=', 'mag', 5],
                symbol : {
                    'markerType' : 'ellipse',
                    'markerLineWidth' : 0,
                    'markerFill' : getGradient([255, 255, 0]),
                    'markerFillOpacity' : 0.8,
                    'markerWidth' : 12,
                    'markerHeight' : 12
                }
            },
            {
                filter : ['>', 'mag', 5],
                symbol : {
                    'markerType' : 'ellipse',
                    'markerLineWidth' : 0,
                    'markerFill' : getGradient([216, 115, 149]),
                    'markerFillOpacity' : 0.8,
                    'markerWidth' : 20,
                    'markerHeight' : 20
                }
            }
        ])
        .addTo(map);
        resolve(layer)

    })
}




/*
    function getGradient(colors) {
        return {
            type : 'radial',
            colorStops : [
              [0.70, 'rgba(' + colors.join() + ', 0.5)'],
              [0.30, 'rgba(' + colors.join() + ', 1)'],
              [0.20, 'rgba(' + colors.join() + ', 1)'],
              [0.00 , 'rgba(' + colors.join() + ', 0)']
            ]
        };
    }
    const geometries = maptalks.GeoJSON.toGeometry(geo);
    const layer = new AnimateMarkerLayer(
        'animatemarker',
        geometries,
        {
            'animation' : 'scale,fade',
            'randomAnimation' : true,
            'geometryEvents' : false
        }
    )
    .setStyle([
        {
            filter : ['<=', 'mag', 2],
            symbol : {
                'markerType' : 'ellipse',
                'markerLineWidth' : 0,
                'markerFill' : getGradient([135, 196, 240]),
                'markerFillOpacity' : 0.8,
                'markerWidth' : 5,
                'markerHeight' : 5
            }
        },
        {
            filter : ['<=', 'mag', 5],
            symbol : {
                'markerType' : 'ellipse',
                'markerLineWidth' : 0,
                'markerFill' : getGradient([255, 255, 0]),
                'markerFillOpacity' : 0.8,
                'markerWidth' : 12,
                'markerHeight' : 12
            }
        },
        {
            filter : ['>', 'mag', 5],
            symbol : {
                'markerType' : 'ellipse',
                'markerLineWidth' : 0,
                'markerFill' : getGradient([216, 115, 149]),
                'markerFillOpacity' : 0.8,
                'markerWidth' : 20,
                'markerHeight' : 20
            }
        }
    ])
    .addTo(map);
*/