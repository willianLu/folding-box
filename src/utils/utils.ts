import config from "@/config";

const hasTouch = 'ontouchstart' in window

export function on(el: Element | Window, fun: any) {
    if(hasTouch) {
        el.addEventListener('touchstart', fun)
    } else {
        el.addEventListener('mousedown', fun)
    }
}

export function off(el: Element | Window, fun: any) {
    if(hasTouch) {
        el.removeEventListener('touchstart', fun)
    } else {
        el.removeEventListener('mousedown', fun)
    }
}

/*
* ui转场景位置
* */
export function pxToCanvas(x: number): number {
    return config.frustumSize * x / config.uiSize
}

/*
* 获取画布大小配置
* */
export function getCanvas() {
    let width = window.innerWidth
    const height = window.innerHeight
    let aspect = height / width
    if (aspect < config.ratio) {
        width = Math.ceil(height / config.ratio)
        aspect = config.ratio
    }
    return {
        width, height, aspect
    }
}

/*
* 更加UI设计转换元素在canvas的呈现
* @ uiWidth UI宽、uiHeight UI高、uiT 当前UI到顶部的高度、uiB 当前UI到底部的高度、uiX 当前UI到左边的距离
* */
export function getPosition(uiWidth: number, uiHeight: number, uiT?: number, uiB?: number, uiX?: number) {
    const { aspect } = getCanvas()
    const w = config.frustumSize
    const width = uiWidth / config.uiSize * config.frustumSize
    const height = width * uiHeight / uiWidth; // 元素H
    const wHeight = config.frustumSize * aspect / 2 // 坐标点
    const x = uiX ? config.frustumSize - (width + uiX) / 2 : 0
    let y = 0
    if(uiT === 0 || uiT) {
        y = wHeight - height / 2 -  w * uiT / config.uiSize
    } else if(uiB === 0 || uiB) {
        y = -wHeight + height / 2 + w * uiB / config.uiSize
    }
    return {
        width, height, x, y
    }
}