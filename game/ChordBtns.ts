import { Gctx } from "./Gctx"
import { qwerty } from "./util/other"
import { ChordBtn } from "./ChordBtn"

const buttonLength = (() => {
    const qwert = qwerty.common
    let count = 0
    for (let j = 0; j < qwert.length; j++) {
        for (let i = 0; i < qwert[j].length; i++) {
            count++
        }
    }
    return count
})()



export class ChordBtns {
    btns: ChordBtn[] = []

    constructor(public gctx: Gctx) {
        this.btns = Array.from(Array(buttonLength)).map(() => {
            return new ChordBtn(gctx)
        })
    }

    getChordBtnById(id: string) {
        const tmp = this.btns.filter(btn => btn.id === id)
        if (!tmp.length) return null
        return tmp[0]
    }

    clear() {
        this.btns.forEach(btn => {
            btn.chordNameInput = ''
            btn.chordName = null
        })
        this.gctx.rerenderUI()
    }
}