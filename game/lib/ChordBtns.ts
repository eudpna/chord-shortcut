import { MutableRefObject } from "react"
import { Gctx } from "../Gctx"
import { chordToName, guitarChords } from "./chords"
import { get_diatonic_chords, next_key } from "./sound/scale"
import { Solfa } from "./sound/solfa"
import { v4 as uuidv4 } from 'uuid'

// const buttonLength = [12, 10]
const buttonLength = 20


const roman_numeric = [
    'I','II','III','IV','V','VI','VII'
]

const diatonic = [
    'I', 'IIm', 'IIIm', 'IV', 'V', 'VIm', 'VIIdim'
]


export class ChordBtn {
    chordNameInput: string = ''
    chordName: string | null = null
    qwerty: string | null = null
    isDown: boolean = false
    ref: MutableRefObject<any> | null
    id = uuidv4()

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
}

export class ChordBtns {
    btns: ChordBtn[] = []

    constructor(public gctx: Gctx) {
        this.btns = Array.from(Array(buttonLength)).map(() => {
            return new ChordBtn(gctx)
        })
    }

    // setDiatonic() {
    //     for (let i = 0; i < 7; i ++) {
    //         this.btns[i].chordNameInput = diatonic[i]
    //         this.make()
    //     }
    // }

    clear() {
        this.btns.forEach(btn => {
            btn.chordNameInput = ''
            btn.chordName = null
        })
        // this.gctx.rerenderUI()
    }

    // setChordNameList(chordNames: string[]) {
    //     this.clearBtns()

    //     chordNames.forEach((chordName, i) => {
    //         this.btns[i].chordNameInput = chordName
    //     })

    //     this.make()
    // }
}