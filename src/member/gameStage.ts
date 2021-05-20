import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import { PlaneImg } from "@/objects";
import { pxToCanvas } from '@/utils'
import hookImg from "@/asset/images/hook.png";
import blockImg from '@/asset/images/block-rope.png'

class GameStage {
    public instance: THREE.Object3D
    public block: PlaneImg

    private readonly py: number // 偏移量
    private rotation: number // 晃动角度
    private readonly mesh: PlaneImg
    private readonly placeholder: THREE.Object3D

    constructor() {
        this.instance = new THREE.Object3D()
        this.py = pxToCanvas(350)
        this.rotation = Math.PI / 6

        this.mesh = new PlaneImg({
            img: hookImg,
            width: 50,
            height: 507,
            top: -180
        })
        this.mesh.moveAnchor();//移动锚点

        // 占位
        this.placeholder = new THREE.Object3D()
        this.placeholder.position.set(0, -this.mesh.height + pxToCanvas(10), 1)

        this.block = new PlaneImg({
            img: blockImg,
            width: 188,
            height: 179
        })
        this.block.instance.visible = false
        this.block.moveAnchor();//移动锚点

        this.mesh.plane.add(this.placeholder)
        this.instance.add(this.mesh.instance)
        this.instance.visible = false

    }

    init() {
        const y = this.instance.position.y
        this.instance.position.y = y + this.py
        const anInstance = new TWEEN.Tween({y: y + this.py}).to({y}, 300).start()
        anInstance.onUpdate(({y}) => {
            this.instance.position.y = y
        })
        anInstance.onComplete(() => {

        })
        this.instance.visible = true
    }

    show(): TWEEN.Tween<{y: number}> {
        this.instance.visible = true
        this.mesh.plane.rotation.z = this.rotation
        const y = this.instance.position.y
        const anInstance = new TWEEN.Tween({y}).to({y: y - this.py}, 200).start()
        anInstance.onUpdate(({y}) => {
            this.instance.position.y = y
        })
        const an = new TWEEN.Tween({z: this.rotation}).to({z: -this.rotation}, 500).easing(TWEEN.Easing.Quadratic.InOut).repeat(Infinity).yoyo(true)
        an.start().onUpdate(({ z }) => {
            this.mesh.plane.rotation.z = z
        })
        return anInstance
    }

    remove() {
        this.block.instance.visible = false
        const y = this.instance.position.y
        const anInstance = new TWEEN.Tween({y}).to({y: y + this.py}, 300).start()
        anInstance.onUpdate(({y}) => {
            this.instance.position.y = y
        })
        anInstance.onComplete(() => {
            this.instance.visible = false
        })

    }

    update() {
        const worldPosition = new THREE.Vector3();
        this.placeholder.getWorldPosition(worldPosition)
        this.block.instance.position.set(worldPosition.x, worldPosition.y - this.block.height / 2, worldPosition.z)
        this.block.instance.updateMatrixWorld(true)
        if(!this.block.instance.visible) this.block.instance.visible = true
    }
}

export default GameStage