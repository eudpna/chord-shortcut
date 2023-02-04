import { isNaturalNumber } from "../../util/str"
import { Solfa, SolfaName } from "./Solfa"

export class Pitch {

    readonly number: number
    readonly octave: number
    readonly isWholeTone: boolean
    readonly solfa: Solfa

    constructor(noteNumber: number) {
        this.number = noteNumber

        this.octave = Math.floor(this.number / 12)

        this.isWholeTone = [0, 2, 4, 5, 7, 9, 11].includes(
            (this.number % 12)
        )

        this.solfa = new Solfa(this.number % 12)
    }

    hasFlat(): boolean {
        return !(new Pitch(this.number-1)).isWholeTone
    }

    static nameToNumber(noteName: string) {

        // validate octave
        const tmp = noteName.slice(-1)
        if (!isNaturalNumber(tmp)) return null
        if (Number(tmp) > 9) return null
        const octave = Number(tmp)

        // validate solfa
        const s0 = noteName.slice(0, noteName.length - 1)
        if (!Solfa.isSolfaName(s0)) return null
        const solfaName = Solfa.sharpToFlat(s0 as SolfaName)
        const noteNumber = 12 + 12 * octave + Solfa.nameToNumber(solfaName)

        return noteNumber
    }

    static numberToName(noteNumber: number) {
        return Solfa.numberToName(noteNumber % 12) +
            String(Math.floor(noteNumber / 12) - 1)   
    }
}

