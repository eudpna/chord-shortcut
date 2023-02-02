import { solfaFlatArr, SolfaToFlat } from "../../game/lib/sound/solfa"

export class Solfa {
    readonly solfaNumber: number
    readonly isWholeNote: boolean
    readonly solfaName: SolfaName


    constructor(solfaNumber: number) {
        this.solfaNumber = solfaNumber

        this.isWholeNote = [0, 2, 4, 5, 7, 9, 11].includes(
            this.solfaNumber
        )
        this.solfaName = solfaNameList[this.solfaNumber]

    }

    toFlat() {
        return this.solfaName
    }

    toSharp(){
        if (this.isWholeNote) return this.solfaName
        return solfaNameListSharpOnly[
            solfaNameListFlatOnly.indexOf(this.solfaName)
        ]
    }


}



export function solfaNameToSolfaNumber(solfaName: SolfaName) {
    const solfaNumber = solfaFlatArr.indexOf(SolfaToFlat(solfaName))
    return solfaNumber
}



// 32 = 全音符
export type SolfaName = 'C' | 'C#' | 'Db' | 'D' | 'D#' | 'Eb' | 'E' | 'F' | 'F#' | 'Gb' | 'G' | 'G#' | 'Ab' | 'A' | 'A#' | 'Bb' | 'B'

// export const solfaNameList = ['C','C#','Db','D','D#','Eb','E','F','F#','Gb','G','G#','Ab','A','A#','Bb','B']

export const solfaNameList: SolfaName[] = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']

export const solfaNameListFlatOnly: SolfaName[] = ['Db', 'Eb', 'Gb', 'Ab', 'Bb']
export const solfaNameListSharpOnly: SolfaName[] = ['C#', 'D#', 'F#', 'G#', 'A#']
export const solfaNameListWholeOnly: SolfaName[] = ['C','D','E','F','G','A','B',]
