import * as THREE from 'three'
import { singleton, getCanvas } from '@/utils'
import Camera from './camera';

@singleton
class Scene {
    public instance: THREE.Scene

    private camera: Camera
    private readonly canvas: HTMLCanvasElement
    private renderer: THREE.WebGL1Renderer

    constructor() {
        this.canvas = document.querySelector('#canvas') as HTMLCanvasElement
        const { width, height } = getCanvas()
        this.renderer = new THREE.WebGL1Renderer({
            canvas: this.canvas,
            antialias: true,
            preserveDrawingBuffer: true
        })
        this.renderer.setSize(width, height)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.instance = new THREE.Scene()
        this.instance.background = new THREE.Color(0x83EDD7)

        this.camera = new Camera()

        // 添加辅助线
        const axesHelper = new THREE.AxesHelper(10e32)
        this.instance.add(axesHelper)

        this.instance.add(this.camera.instance)
    }

    render() {
        this.renderer.render(this.instance, this.camera.instance)
    }
}

export default Scene