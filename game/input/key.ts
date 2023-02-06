import { Gctx } from "../Gctx"
import { qwerty } from "../util/other"


export function setKeyEventListeners(gctx: Gctx) {
    window.addEventListener('keydown', (e) => {
        if ((e.target as HTMLElement).closest('.prevent-shot')) {
            return
        }
        const key = replaceKeyName(e.key)

        // klavierKeyに対応するキーが押下され　　かつ
        // すでに押されていなければ
        let retur = false
        gctx.klavier.keys.forEach(klavierKey => {
            if (!gctx.keyboardToPiano) return
            if (klavierKey.qwerty === key
                && !gctx.input.keys.includes(key)
            ) {
                klavierKey.down()
                retur = true
            }
        })


        const isTheKeyAssignedToPiano = (gctx.keyboardToPiano && qwerty.common.slice(-2).flatMap(t => t.flatMap(s => s.toLowerCase())).includes(e.key.toLowerCase()))

        if (!isTheKeyAssignedToPiano) {
            // chordBtnに対応するキーが押下され　　かつ
            // すでに押されていなければ
            gctx.chordBtns.btns.forEach(chordBtn => {
                if (chordBtn.qwerty === key
                    && !gctx.input.keys.includes(key)
                ) {
                    chordBtn.down()
                }
            })
        }

        addKey(gctx, key)
    })

    window.addEventListener('keyup', (e) => {
        if ((e.target as HTMLElement).closest('.prevent-shot')) {
            return
        }

        const key = replaceKeyName(e.key)

        // klavierKeyに対応するキーが離されたら
        gctx.klavier.keys.forEach(klavierKey => {
            if (!gctx.keyboardToPiano) return
            if (klavierKey.qwerty === key
            ) {
                klavierKey.up()
            }
        })

        const isTheKeyAssignedToPiano = (gctx.keyboardToPiano && qwerty.common.slice(-2).flatMap(t => t.flatMap(s => s.toLowerCase())).includes(e.key.toLowerCase()))

        if (!isTheKeyAssignedToPiano) {
            // chordBtnに対応するキーが離されたら
            gctx.chordBtns.btns.forEach(chordBtn => {
                if (chordBtn.qwerty === key
                ) {
                    chordBtn.up()
                }
            })
        }

        removeKey(gctx, key)
    })
}

function replaceKeyName(k: string): string {
    let key = k.toLowerCase()
    return key
}


function addKey(gctx: Gctx, key: string) {
    if (gctx.input.keys.includes(key)) return
    gctx.input.keys.push(key)
}

function removeKey(gctx: Gctx, key: string) {
    gctx.input.keys = gctx.input.keys.filter(k => k !== key)
}