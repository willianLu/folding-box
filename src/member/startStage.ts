import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import {singleton, pxToCanvas} from '@/utils'
import {PlaneImg} from "@/objects";
import headImg from '@/asset/images/main-index-title.png'
import btnImg from '@/asset/images/main-index-start.png'


/**
 * 开始场景
 * */
@singleton
class StartStage {
    public instance: THREE.Object3D
    public btnName: string

    private head: PlaneImg
    private headTween: TWEEN.Tween<{ z: number }>
    public btn: PlaneImg

    constructor() {
        this.instance = new THREE.Object3D()
        this.btnName = 'startBtn'

        this.head = new PlaneImg({
            img: headImg,
            width: 398,
            height: 520,
            top: 0,
            z: 10
        })
        this.head.moveAnchor(); //移动锚点

        const angle = Math.PI / 25
        this.head.plane.rotation.z = angle
        this.headTween = new TWEEN.Tween({z: angle}).to({z: -angle}, 1500).easing(TWEEN.Easing.Quadratic.InOut).repeat(Infinity).yoyo(true)

        this.btn = new PlaneImg({
            img: btnImg,
            width: 470,
            height: 140,
            bottom: 100
        })
        this.btn.instance.name = this.btnName

        this.instance.add(this.head.instance)
        this.instance.add(this.btn.instance)
    }

    show() {
        this.head.instance.visible = true
        this.btn.instance.visible = true
        this.headTween.onUpdate(({z}) => {
            this.head.plane.rotation.z = z;
        })
        this.headTween.start()
    }

    hide() {
        this.headTween.stop()
        const headDY = this.head.instance.position.y
        const headPY = headDY + pxToCanvas(780)
        new TWEEN.Tween({y: headDY})
            .to({y: headPY}, 300)
            .easing(TWEEN.Easing.Linear.None).onUpdate(({y}) => {
                this.head.instance.position.y = y
            }).start()

        const btnDY = this.btn.instance.position.y
        const btnPY = btnDY - pxToCanvas(240)
        const btnTween = new TWEEN.Tween({y: btnDY})
            .to({y: btnPY}, 300)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(({y}) => {
                this.btn.instance.position.y = y
            }).start()
        btnTween.onComplete(() => {
            this.head.instance.visible = false
            this.head.instance.position.y = headDY
            this.btn.instance.visible = false
            this.btn.instance.position.y = btnDY
        })
    }
}

export default StartStage