import { isNotenumHasFlat, notenumListWhole } from "./lib/sound/scale"
import { v4 as uuidv4 } from 'uuid'
import { MutableRefObject } from "react"
import { Gctx } from "./Gctx"

export class KlavierKey {
    readonly notenum: number
    readonly isBlack: boolean
    isDown: boolean

    ref: MutableRefObject<any> | null
    id = uuidv4()

    constructor(public gctx: Gctx, notenum: number, isBlack: boolean) {
        this.notenum = notenum
        this.isBlack = isBlack
    }

    down() {
        this.isDown = true
        this.gctx.playNote(this.notenum)
        this.gctx.rerenderUI()
    }

    up() {
        this.isDown = false
        this.gctx.stopNote(this.notenum)
        this.gctx.rerenderUI()
    }
}

export class Klavier {

    keys: KlavierKey[] = []

    // startNoteNumとlengthは全音(白鍵)
    constructor(public gctx: Gctx, public startNoteNum: number, public length: number) {
        // console.log(startNoteNum, length)
        const keys = []
        for (let i = 0; i < length; i++) {
            const index = notenumListWhole.indexOf(startNoteNum)
            const notenum = notenumListWhole[index + i]
            // console.log(index, notenum)
            // フラット(黒鍵)がある場合それを追加
            // ただし左端の白鍵のときは無視
            if (i !== 0 && isNotenumHasFlat(notenum)) {
                keys.push(new KlavierKey(this.gctx,notenum-1,true))
            }
            // 白鍵
            keys.push(new KlavierKey(this.gctx, notenum, false))
        }
        this.keys = keys
        // console.log(keys)
    }
}
