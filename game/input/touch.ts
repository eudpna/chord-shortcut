import { Gctx } from "../Gctx"



function handleTouch(e: TouchEvent, gctx: Gctx) {
    // chordBtn,klavierKeyからマウスが離れていたら離す
    const klavierEls = Array.from(document.getElementsByClassName('klavierkey-el'))

    const chordBtnEls = Array.from(document.getElementsByClassName('chordbtn-el'))

    const elList = []

    
    Array.from(e.touches).map(touch => {
        // 追加
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        elList.push(el)
        
    })

    console.log(elList)

    elList.map(el => {
        if (el.classList.contains('klavierkey-el')) {
            console.log('kla', el)
            const key = gctx.klavier.getKeyById(el.id)
            if (!key.isDown) key.down()
        }
        if (el.classList.contains('chordbtn-el')) {
            console.log('chor', el)
            const key = gctx.chordBtns.getChordBtnById(el.id)
            if (!key.isDown) key.down()
        }
    })

    klavierEls.filter(k => !elList.includes(k)).forEach(el => {        
        const key = gctx.klavier.getKeyById(el.id)
        if (key.isDown) key.up()
    })
    chordBtnEls.filter(k => !elList.includes(k)).forEach(el => {
        const key = gctx.chordBtns.getChordBtnById(el.id)
        if (key.isDown) key.up()
    })


}


export function setTouchEventListeners(gctx: Gctx) {
    document.addEventListener('touchmove', (e) => {
        // handleTouch(e, gctx)
    })

    document.addEventListener('touchstart', (e) => {
        handleTouch(e, gctx)
    })

    document.addEventListener('touchend', (e) => {
        handleTouch(e, gctx)
    })
    
}

