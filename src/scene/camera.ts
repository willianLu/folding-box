import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import { singleton, getCanvas } from '@/utils'
import config from '@/config'

@singleton
class Camera {
    public instance: THREE.OrthographicCamera
    public target: THREE.Vector3

    constructor() {
        const { aspect } = getCanvas()
        this.instance = new THREE.OrthographicCamera(-config.frustumSize / 2, config.frustumSize / 2, config.frustumSize * aspect / 2, -config.frustumSize * aspect / 2, -1000, 1000)
        this.instance.position.set(0, 0, 0)
        this.target = new THREE.Vector3(0, 0, 0)
        this.instance.lookAt(this.target)
    }

    updatePosition(newTargetPosition: { x: number, y: number, z: number }, time = 400): TWEEN.Tween<{ x: number, y: number, z: number }> {
        const an = new TWEEN.Tween(this.instance.position).to(newTargetPosition, time).start()
        an.onUpdate(({x, y, z}) => {
            this.instance.position.set(x, y, z)
        })
        return an
    }


}


export default Camera