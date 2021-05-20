import * as TWEEN from '@tweenjs/tween.js'
import config from "@/config";
import { singleton, pxToCanvas, on, off, getCanvas } from '@/utils'
import type { Scene, Camera } from '@/scene'
import GameStage from '@/member/gameStage'
import Brick from '@/member/brick'
import Cloud from '@/member/cloud'

enum Status {
    'start',
    'stop',
    'await'
}

enum Result {
    'start',
    'Left', // 左边掉下去
    'right', // 右边掉下去
    'top', // 稳住
    'bottom' // 失败
}

@singleton
class GamePage {
    static scene?: Scene
    static camera?: Camera

    private low: number // 到达底部
    private target: number // 当前叠加位置
    private area: {min: number, max: number}
    private cameraTop: number
    private readonly canvas: HTMLCanvasElement
    private stage: GameStage
    private status: Status
    private result?: Result
    private currentBrick: Brick
    private cloud: number // 3 b次添加一个云

    constructor() {
        const { aspect } = getCanvas()
        this.result = Result.start
        this.status = Status.stop
        this.canvas = document.querySelector('#canvas') as HTMLCanvasElement
        this.stage = new GameStage();
        this.currentBrick = new Brick()
        this.currentBrick.instance.visible = false
        this.target =  - config.frustumSize * aspect / 2 + pxToCanvas(740)
        this.low = - config.frustumSize * aspect / 2 - pxToCanvas(10) - this.currentBrick.height / 2
        this.cloud = 0
        this.area = {
            min: -config.frustumSize,
            max: config.frustumSize
        }
        this.cameraTop = pxToCanvas(260)
    }

    get scene(): Scene {
        return GamePage.scene as Scene
    }

    get camera(): Camera {
        return GamePage.camera as Camera
    }

    show(scene: Scene, camera: Camera) {
        GamePage.scene = scene
        GamePage.camera = camera
        this.status = Status.start
        this.camera.instance.add(this.stage.instance)
        this.stage.init()
        this.scene.instance.add(this.stage.block.instance)
        this.scene.instance.add(this.currentBrick.instance)
        const an = this.camera.updatePosition({
            x: 0,
            y: this.cameraTop,
            z: 0
        })
        this.addCloud()
        an.onComplete(() => {
            this.bindTouchStart()
        })
    }

    update() {
        if(this.status === Status.start || this.status === Status.await) {
            this.stage.update()
        }
    }

    addCloud() {
        if(this.cloud % 3 === 0) {
            const y = this.cloud * this.currentBrick.height + pxToCanvas(800)
            const cloud = new Cloud(y)
            cloud.update()
            this.scene.instance.add(cloud.instance)
        }
        this.cloud += 1
    }

    addInitBlock() {
        this.status = Status.stop
        this.stage.remove()
        this.currentBrick.instance.visible = true
        const { x, y } = this.stage.block.instance.position
        this.currentBrick.instance.position.x = x
        this.currentBrick.instance.position.y = y - pxToCanvas(22)
        this.currentBrick.instance.position.z = 1
        const defaultArea = {
            min: x - this.currentBrick.width / 2,
            max: x + this.currentBrick.width / 2
        }
        const an = new TWEEN.Tween({y: y - pxToCanvas(22)}).to({y: this.low}, 1000).easing(TWEEN.Easing.Quadratic.In).start()
        an.onUpdate(({ y }) => {
            this.currentBrick.instance.position.y = y
            if(y <= this.target && this.result === Result.start) {
                if(defaultArea.max >= this.area.min && defaultArea.min <= this.area.max) { // 存在碰撞
                    let w = 0
                    if(defaultArea.max <= this.area.max) {
                        this.result = Result.Left
                        w = defaultArea.max - this.area.min
                    } else {
                        this.result = Result.right
                        w = this.area.max - defaultArea.min
                    }
                    if(this.currentBrick.width / 5 * 2 <= w) {
                        this.result = Result.top
                        this.area = defaultArea
                        this.currentBrick.instance.position.y = this.target
                    }
                    an.stop()
                    this.nextAddBrick()
                }
            }

        })
        an.onComplete(() => {
            this.result = Result.bottom
            this.scene.instance.remove(this.currentBrick.instance)
            this.nextAddBrick()
        })
    }

    towerResult() {
        this.result = Result.start
        this.status = Status.await
        this.currentBrick = new Brick()
        this.currentBrick.instance.visible = false
        this.scene.instance.add(this.currentBrick.instance)
        this.stage.show()
        setTimeout(() => {
            this.status = Status.start
        }, 300)
    }

    nextAddBrick() {
        switch (this.result) {
            case Result.Left: {
                const x = this.currentBrick.instance.position.x
                const an = new TWEEN.Tween({z: 0, x }).to({z: Math.PI / 2, x: x - this.currentBrick.width / 2 }, 200).start()
                an.onUpdate(({ z, x }) => {
                    this.currentBrick.instance.rotation.z = z
                    this.currentBrick.instance.position.x = x
                })

                const y = this.currentBrick.instance.position.y
                const up = new TWEEN.Tween({y }).to({y: this.low}, 600).easing(TWEEN.Easing.Quadratic.In).start()
                up.onUpdate(({ y }) => {
                    this.currentBrick.instance.position.y = y
                })
                up.onComplete(() => {
                    this.towerResult()
                })
                break
            }
            case Result.right: {
                const x = this.currentBrick.instance.position.x
                const an = new TWEEN.Tween({z: 0, x }).to({z: -Math.PI / 2, x: x + this.currentBrick.width / 2 }, 200).start()
                an.onUpdate(({ z, x }) => {
                    this.currentBrick.instance.rotation.z = z
                    this.currentBrick.instance.position.x = x
                })

                const y = this.currentBrick.instance.position.y
                const up = new TWEEN.Tween({y }).to({y: this.low}, 600).easing(TWEEN.Easing.Quadratic.In).start()
                up.onUpdate(({ y }) => {
                    this.currentBrick.instance.position.y = y
                })
                up.onComplete(() => {
                    this.towerResult()
                })
                break
            }
            case Result.bottom: {
                this.towerResult()
                break
            }
            case Result.top: {
                this.cameraTop = this.currentBrick.height + this.camera.instance.position.y
                this.target += this.currentBrick.height - pxToCanvas(2)
                this.low += this.currentBrick.height
                const an = this.camera.updatePosition({
                    x: 0,
                    y: this.cameraTop,
                    z: 0
                }, 200)
                an.onComplete(() => {
                    this.towerResult()
                })
                this.addCloud()
                break
            }
        }
    }

    touchStartFun = () => {
        if(this.status === Status.start) {
            this.addInitBlock()
        }
    }

    bindTouchStart() {
        on(this.canvas, this.touchStartFun)
    }

    removeTouchStart() {
        off(this.canvas, this.touchStartFun)
    }
}

export default GamePage