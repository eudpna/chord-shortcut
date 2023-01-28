import { isNotenumHasFlat, notenumListWhole } from "./lib/sound/scale"
import { v4 as uuidv4 } from 'uuid'
import { MutableRefObject } from "react"
import { Gctx } from "./Gctx"
import { Pitch } from "../lib/music/Pitch"

export class KlavierKey {
    // readonly noteNumber: number
    readonly pitch: Pitch
    isDown: boolean
    disabled: boolean = false

    ref: MutableRefObject<any> | null
    id = uuidv4()

    constructor(public gctx: Gctx, noteNumber: number) {
        this.pitch = new Pitch(noteNumber)
    }

    down() {
        this.isDown = true
        this.gctx.playNote(this.pitch.noteNumber)
        this.gctx.rerenderUI()
    }

    up() {
        this.isDown = false
        this.gctx.stopNote(this.pitch.noteNumber)
        this.gctx.rerenderUI()
    }
}

export class Klavier {

    keys: KlavierKey[] = []

    constructor(public gctx: Gctx, public startNoteNum: number, public length: number) {
        for (let i = startNoteNum; i < startNoteNum + length; i++) {
            const klavierKey = new KlavierKey(gctx, i)
            this.keys.push(klavierKey)
        }

        // 端の黒鍵は非表示にする
        if (!this.keys[0].pitch.isWholeTone) {
            this.keys[0].disabled = true
        }
        if (!this.keys[this.keys.length-1].pitch.isWholeTone) {
            this.keys[this.keys.length-1].disabled = true
        }
    }
}
