import * as THREE from 'three'
import BasePlane from '@/objects/base-plane';
import brickDefault from "@/asset/images/block.png";
import brickActive from '@/asset/images/block-perfect.png'


class Brick extends BasePlane {
    public instance: THREE.Object3D

    private loader: THREE.TextureLoader

    constructor() {
        const loader = new THREE.TextureLoader()
        super({ width: 188, height: 134, materialData: { map: loader.load(brickDefault), transparent: true }})
        this.loader = loader
        this.instance = new THREE.Object3D()
        this.instance.position.set(this.x, this.y, this.z)
        this.instance.add(this.plane)
    }

    update() {
        const texture = this.loader.load(brickActive)
        this.material = new THREE.MeshBasicMaterial({ map: texture, transparent: true })
    }
}

export default Brick