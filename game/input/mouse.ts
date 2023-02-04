import { Gctx } from "../Gctx"

export function setMouseEventListeners(gctx: Gctx) {
    window.addEventListener('mousedown', (e) => {
        gctx.input.mouse.isDown = true
    })
    window.addEventListener('mouseup', (e) => {
        gctx.input.mouse.isDown = false
    })
}

