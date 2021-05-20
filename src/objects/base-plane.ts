import * as THREE from 'three'
import { getPosition } from '@/utils'

interface OptionsPlan {
    width: number
    height: number
    materialData: THREE.MeshBasicMaterialParameters
    bottom?: number
    top?: number
    x?: number
    y?: number
    z?: number
}

class BasePlane {
    public width: number
    public height: number
    public x: number
    public y: number
    public z: number
    public plane: THREE.Mesh

    protected geometry: THREE.PlaneGeometry
    protected material: THREE.MeshBasicMaterial

    constructor(options: OptionsPlan) {
        const { width, height, x, y } = getPosition(options.width, options.height, options.top, options.bottom, options.x)
        this.width = width
        this.height = height
        this.x = x
        this.y = y || options.y || 0
        this.z = options.z || 0
        this.geometry = new THREE.PlaneGeometry(this.width, this.height)

        this.material = new THREE.MeshBasicMaterial(options.materialData)
        this.plane = new THREE.Mesh(this.geometry, this.material)
    }

    moveAnchor() {
        const position = this.geometry.getAttribute("position");
        position.setXYZ(0, -this.width / 2, 0, 0);
        position.setXYZ(1, this.width / 2, 0, 0);
        position.setXYZ(2, -this.width / 2, -this.height, 0);
        position.setXYZ(3, this.width / 2, -this.height, 0);
        this.plane.position.set(0, this.height / 2, 0)
    }
}

export default BasePlane