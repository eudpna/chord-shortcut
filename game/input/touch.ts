import { Gctx } from "../Gctx"
import { getElementRect } from "../lib/dom"
import { isInRect } from "../lib/math"

export function setTouchEventListeners(gctx: Gctx) {

    const listener = (e) => {
        checkTouches(e, gctx)
    }

    window.addEventListener('touchstart', listener)
    window.addEventListener('touchend', listener) 
    window.addEventListener('touchmove', listener)
}


function touchToVec2(touch: Touch) {
    return {
        x: touch.clientX,
        y: touch.clientY
    }
}

function checkTouches(e: TouchEvent, gctx: Gctx) {

    const els = gctx.chordBtns.btns.map(b => b.el).concat(
        gctx.klavier.keys.map(k => k.el)
    )
    
    els.map(el => {
        if (!el) return
        const tmp = Array.from(e.touches).filter(touch => {            
            const p = touchToVec2(touch)
            const isTopmost = document.elementFromPoint(p.x, p.y) === el
            return isInRect(
                p,
                getElementRect(el)
            ) && isTopmost
            
        })        
        const key = gctx.klavier.getKeyById(el.id)
        const btn = gctx.chordBtns.getChordBtnById(el.id)
        if (key) {
            if (tmp.length === 0) {
                key.up()
            } else {
                key.down()
            }
        }
        if (btn) {
            if (tmp.length === 0) {
                btn.up()
            } else {
                btn.down()
            }  
        }
        
    })
}