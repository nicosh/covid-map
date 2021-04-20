import * as THREE from 'three';
import * as maptalks from 'maptalks';
import { ThreeLayer, BaseObject } from 'maptalks.three/dist/maptalks.three.js'
var OPTIONS = {
    radius: 100,
    altitude: 0
};
class Circle extends BaseObject {
    constructor(coordinate, options, material, layer) {
        options = maptalks.Util.extend({}, OPTIONS, options, { layer, coordinate });
        super();
        //Initialize internal configuration
        // https://github.com/maptalks/maptalks.three/blob/1e45f5238f500225ada1deb09b8bab18c1b52cf2/src/BaseObject.js#L135
        this._initOptions(options);
        const { altitude, radius } = options;
        //generate geometry
        const r = layer.distanceToVector3(radius, radius).x
        const geometry = new THREE.CircleBufferGeometry(r, 50);

        //Initialize internal object3d
        // https://github.com/maptalks/maptalks.three/blob/1e45f5238f500225ada1deb09b8bab18c1b52cf2/src/BaseObject.js#L140
        this._createMesh(geometry, material);

        //set object3d position
        const z = layer.distanceToVector3(altitude, altitude).x;
        const position = layer.coordinateToVector3(coordinate, z);
        this.getObject3d().position.copy(position);
        // this.getObject3d().rotation.x = -Math.PI;
    }


    /**
     * animateShow test
     * 
     * */
    animateShow(options = {}, cb) {
        if (this._showPlayer) {
            this._showPlayer.cancel();
        }
        if (maptalks.Util.isFunction(options)) {
            options = {};
            cb = options;
        }
        const duration = options['duration'] || 1000,
            easing = options['easing'] || 'out';
        const player = this._showPlayer = maptalks.animation.Animation.animate({
            'scale': 1
        }, {
            'duration': duration,
            'easing': easing
        }, frame => {
            const scale = frame.styles.scale;
            if (scale > 0) {
                this.getObject3d().scale.set(scale, scale, scale);
            }
            if (cb) {
                cb(frame, scale);
            }
        });
        player.play();
        return player;
    }
}

export default Circle