import { chordToName, guitarChords } from "./chords"
import { get_diatonic_chords, next_key } from "./sound/scale"
import { Solfa } from "./sound/solfa"

// const buttonLength = [12, 10]
const buttonLength = 20


const roman_numeric = [
    'I','II','III','IV','V','VI','VII'
]

const diatonic = [
    'I', 'IIm', 'IIIm', 'IV', 'V', 'VIm', 'VIIdim'
]


export class ChordBtn {
    keybind: string = ''
    chordName: string | null = null
    qwerty: string | null = null
}

export class ChordBtns {
    btns: ChordBtn[] = []

    constructor() {
        this.btns = Array.from(Array(buttonLength)).map(() => {
            return new ChordBtn
        })
    }

    keybindToChordName(key: Solfa) {
        this.btns.map(btn => {
            // ローマ数字をsolfaに変換
            const n1 = btn.keybind
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

    setDiatonic(key: Solfa) {
        for (let i = 0; i < 7; i ++) {
            this.btns[i].keybind = diatonic[i]
            this.keybindToChordName(key)
        }
    }
}