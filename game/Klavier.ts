import { v4 as uuidv4 } from 'uuid'
import { MutableRefObject } from "react"
import { Gctx } from "./Gctx"
import { Pitch } from "./lib/music/Pitch"
import { qwerty } from './util/other'

export class KlavierKey {
    readonly pitch: Pitch
    isDown: boolean
    disabled: boolean = false
    qwerty: string | null = null
    el: Element | null = null
    
    id = uuidv4()

    touches: number = 0

    constructor(public gctx: Gctx, noteNumber: number) {
        this.pitch = new Pitch(noteNumber)
    }

    down() {
        if (this.isDown) return
        this.isDown = true
        this.gctx.audier.playNote(this.pitch.number)
        this.gctx.rerenderUI()
    }

    up() {
        if (!this.isDown) return
        this.isDown = false
        this.gctx.audier.stopNote(this.pitch.number)
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

        this.setQwerty()
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


    setQwerty() {
        const qwer = qwerty.common
        // ノートにキーを割り当て
        const startNote = 48 + 7
        const whiteKeys = this.keys.filter(key => key.pitch.isWholeTone)
        const dan = [2, 3]
        let j = startNote
        for (let i = 0; i < whiteKeys.length && i < qwer[dan[0]].length && i < qwer[dan[1]].length; i++) {
            if (!(new Pitch(j).isWholeTone)) j++
            const key = this.getKeyByNoteNunber(j)
            if (!key) {
                break
            }
            // 白鍵だったら
            if (key.pitch.isWholeTone) {
                key.qwerty = qwer[dan[1]][i].toLowerCase()
                // その左上に黒鍵があったら
                if (key.pitch.hasFlat()) {
                    const blackKey = this.getKeyByNoteNunber(key.pitch.number - 1)
                    if (blackKey) {
                        blackKey.qwerty = qwer[dan[0]][i].toLowerCase()
                    }
                }
            }
            j++
        }
    }
}
