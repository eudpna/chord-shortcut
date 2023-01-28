import { Gctx } from "../Gctx"


export function setMouseEventListeners(gctx: Gctx) {
    window.addEventListener('mousedown', (e) => {
        gctx.input.mouse.isDown = true
    })
    window.addEventListener('mouseup', (e) => {
        gctx.input.mouse.isDown = false
    })

    // マウスが離れていたらchordBtnを離す
    window.addEventListener('mousemove', (e) => {
        console.log((e.target as HTMLElement).closest('#chordBtn-' + gctx.chordBtns.btns[0].id))
        gctx.chordBtns.btns.forEach(chordBtn => {
            if (!chordBtn.ref || !chordBtn.ref.current) return
            if ((e.target as HTMLElement).closest('#chordBtn-'+chordBtn.id)) {
            } else {
                if (chordBtn.isDown) {
                    chordBtn.up()
                    console.log('up!')
                }
                
            }
        })
    })
}

