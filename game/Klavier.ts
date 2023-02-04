import { v4 as uuidv4 } from 'uuid'
import { MutableRefObject } from "react"
import { Gctx } from "./Gctx"
import { Pitch } from "./lib/music/Pitch"

export class KlavierKey {
    // readonly noteNumber: number
    readonly pitch: Pitch
    isDown: boolean
    disabled: boolean = false
    qwerty: string | null = null

    ref: MutableRefObject<any> | null
    id = uuidv4()

    touches: number = 0

    constructor(public gctx: Gctx, noteNumber: number) {
        this.pitch = new Pitch(noteNumber)
    }

    down() {
        this.isDown = true
        this.gctx.playNote(this.pitch.number)
        this.gctx.rerenderUI()
    }

    up() {
        this.isDown = false
        this.gctx.stopNote(this.pitch.number)
        this.gctx.rerenderUI()
    }

    addTouch() {
        this.touches++
        if (!this.isDown) this.down()

    }

    removeTouch() {
        this.touches--
        if (this.touches === 0) {
            if (this.isDown) this.up()
        }
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

    getKeyById(id: string) {
        const tmp = this.keys.filter(btn => btn.id === id)
        if (!tmp.length) return null
        return tmp[0]
    }

    getKeyByNoteNunber(noteNumber: number): KlavierKey | null{
        const tmp = this.keys.filter(key => key.pitch.number === noteNumber)
        if (tmp.length === 0) return null
        return tmp[0]
    }
}
