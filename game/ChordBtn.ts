import { Gctx } from "./Gctx"
import { v4 as uuidv4 } from 'uuid'


export class ChordBtn {    
    chordName: string | null = null
    qwerty: string | null = null
    isDown: boolean = false
    id = uuidv4()

    constructor(public gctx: Gctx) {        
    }

    down() {
        
        this.isDown = true
        if (this.chordName) {
            this.gctx.audier.playChord(this.chordName)
        }
        this.gctx.rerenderUI()
    }

    up() {
        this.isDown = false
        this.gctx.audier.stopChord(this.chordName)
        this.gctx.rerenderUI()
    }
}