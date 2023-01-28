import { Solfa } from "./Solfa"

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

