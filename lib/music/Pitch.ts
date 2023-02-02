import { solfaArr, solfaFlatArr, SolfaToFlat } from "../../game/lib/sound/solfa"
import { isNumeric } from "../lib1"
import { Solfa, SolfaName } from "./Solfa"

export class Pitch {

    readonly noteNumber: number
    readonly octave: number
    readonly isWholeTone: boolean
    readonly solfa: Solfa

    constructor(noteNumber: number) {
        this.noteNumber = noteNumber

        this.octave = Math.floor(this.noteNumber / 12)

        this.isWholeTone = [0, 2, 4, 5, 7, 9, 11].includes(
            (this.noteNumber % 12)
        )

        this.solfa = new Solfa(this.noteNumber % 12)
    }

    hasFlat(): boolean {
        return !(new Pitch(this.noteNumber-1)).isWholeTone
    }
}


export function noteNameToNoteNumber(noteName: string) {

    // validate octave
    const tmp = noteName.slice(-1)
    if (!isNumeric(tmp)) return null
    const t1 = Number(tmp)
    if (t1 % 1 === 0 && t1 > 0 && t1 < 10) {

    } else {
        return null
    }

    const octave = t1

    // validate solfa

    const s0 = noteName.slice(0, noteName.length - 1)
    if (!solfaArr.includes(s0)) return null
    const solfa = SolfaToFlat(s0 as SolfaName)

    const noteNumber = 12 + 12 * octave + solfaFlatArr.indexOf(solfa)

    return noteNumber
}

