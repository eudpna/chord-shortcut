import { MutableRefObject } from "react"
import { Gctx } from "./Gctx"
import { v4 as uuidv4 } from 'uuid'


export class ChordBtn {
    chordNameInput: string = ''
    chordName: string | null = null
    qwerty: string | null = null
    isDown: boolean = false
    ref: MutableRefObject<any> | null
    id = uuidv4()

    touches: number = 0

    constructor(public gctx: Gctx) {
        
    }

    down() {
        this.isDown = true
        this.gctx.playChord(this.chordName)
        this.gctx.rerenderUI()
    }

    up() {
        this.isDown = false
        this.gctx.stopChord(this.chordName)
        this.gctx.rerenderUI()
    }

    addTouch() {
        this.touches ++
        if (!this.isDown) this.down()
        
    }

    removeTouch() {
        this.touches --
        if (this.touches === 0) {
            if (this.isDown) this.up()
        }
    }
}