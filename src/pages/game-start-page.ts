import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import {GamePageCallbacks, PageName} from '@/types'
import {getCanvas, off, on, singleton, pxToCanvas} from '@/utils'
import {Camera, Scene} from '@/scene'
import {PlaneImg} from '@/objects'
import StartStage from '@/member/startStage'
import Cloud from '@/member/cloud'
import backgroundImg from '@/asset/images/background.png'

@singleton
class GameStartPage {
    public scene: Scene
    public camera: Camera

    private callbacks: Partial<GamePageCallbacks>
    private readonly stage: StartStage

    constructor() {
        this.callbacks = {}
        
        this.camera = new Camera()
        this.scene = new Scene()

        this.stage = new StartStage()
    }

    init(callbacks: GamePageCallbacks) {
        this.callbacks = callbacks

        this.show()
        this.render()
    }

    show() {
        this.addBackground()
        this.addCloud();
        this.stage.show()
        this.scene.instance.add(this.stage.instance)
        this.bindTouchStart();
    }

    hide() {
        this.stage.hide()
        this.removeTouchStart()
    }

    addBackground() {
        const background = new PlaneImg({
            img: backgroundImg,
            width: 750,
            height: 1050,
            z: -1,
            bottom: 0
        })
        this.scene.instance.add(background.instance)
    }

    addCloud() {
        const { height } = getCanvas()
        for (let i = pxToCanvas(200); i < height; i += pxToCanvas(300)) {
            const cloud = new Cloud(i)
            cloud.update()
            this.scene.instance.add(cloud.instance)
        }
    }

    render() {
        TWEEN.update()
        this.callbacks.update?.()
        this.scene.render()
        requestAnimationFrame(this.render.bind(this))
    }

    touchStartFun = (event: any) => {
        // 事件分析
        const x = event.touches ? event.touches[0].clientX : event.offsetX
        const y = event.touches ? event.touches[0].clientY : event.offsetY

        const { width, height} = getCanvas()
        const xy = {
            x: x / width * 2 - 1,
            y: -1*(y / height * 2 - 1)
        }
        const rc = new THREE.Raycaster();
        rc.setFromCamera(xy, this.camera.instance);

        const result = rc.intersectObjects(this.stage.instance.children, true);
        if(result[0]?.object?.parent?.name === this.stage.btnName) {
            this.callbacks.changeGamePage?.(PageName.game)
        }
    }

    bindTouchStart() {
        on(window, this.touchStartFun)
    }

    removeTouchStart() {
        off(window, this.touchStartFun)
    }
}

export default GameStartPage