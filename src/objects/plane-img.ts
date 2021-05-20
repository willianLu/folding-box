import * as THREE from 'three'
import BasePlane from './base-plane';

interface OptionsPlan {
    img: string
    width: number
    height: number
    x?: number
    bottom?: number
    top?: number
    z?: number
}

class PlaneImg extends BasePlane {
    public instance: THREE.Group

    constructor(options: OptionsPlan) {
        const { width, height, x, bottom, top, z } = options
        const texture = new THREE.TextureLoader().load(options.img)
        super({ width, height, x, bottom, top, z, materialData: {
                map: texture,
                transparent: true
            }})

        this.instance = new THREE.Group()
        this.instance.position.set(this.x, this.y, this.z)
        this.instance.add(this.plane)
    }
}

export default PlaneImg