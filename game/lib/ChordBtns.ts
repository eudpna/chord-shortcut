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

    make() {
        const key = this.gctx.key
        this.btns.map(btn => {
            // ローマ数字をsolfaに変換
            const n1 = btn.chordNameInput
                .replace(roman_numeric[6], next_key(key, 11))
                .replace(roman_numeric[5], next_key(key, 9))
                .replace(roman_numeric[3], next_key(key, 5))
                .replace(roman_numeric[4], next_key(key, 7))
                .replace(roman_numeric[2], next_key(key, 4))
                .replace(roman_numeric[1], next_key(key, 2))
                .replace(roman_numeric[0], next_key(key, 0))

            const name = guitarChords.getChordByName(n1);

            if (!name) btn.chordName = null
            else btn.chordName = n1
        })
    }

    setDiatonic() {
        for (let i = 0; i < 7; i ++) {
            this.btns[i].chordNameInput = diatonic[i]
            this.make()
        }
    }

    clearBtns() {
        this.btns.forEach(btn => {
            btn.chordNameInput = ''
        })
        this.make()
        this.gctx.rerenderUI()
    }

    setChordNameList(chordNames: string[]) {
        this.clearBtns()

        chordNames.forEach((chordName, i) => {
            this.btns[i].chordNameInput = chordName
        })

        this.make()
    }
}