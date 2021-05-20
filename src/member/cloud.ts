import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import config from '@/config'
import BasePlane from '@/objects/base-plane';
import img from '@/asset/images/c2.png'


class Cloud extends BasePlane {
    public instance: THREE.Object3D

    private loader: THREE.TextureLoader
    private an?: TWEEN.Tween<{ x: number }>

    constructor(y: number) {
        const loader = new THREE.TextureLoader()
        super({ width: 200, height: 200, y, z: 2, materialData: { map: loader.load(img), transparent: true }})
        this.loader = loader
        this.instance = new THREE.Object3D()
        this.instance.position.set(this.x, this.y, this.z)
        this.instance.add(this.plane)
    }

    update() {
        const m = Math.random() > 0.5 ? 1 : -1
        const x = m * config.frustumSize / 2
        this.an = new TWEEN.Tween({x: x}).to({x: 0}, 10000).repeat(Infinity).yoyo(true)
        this.an.start()
        this.an.onUpdate(({ x }) => {
            this.instance.position.x = x
        })
    }

    remove() {
        this.an?.stop()
    }
}

export default Cloud