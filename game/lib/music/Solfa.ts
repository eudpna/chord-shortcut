export type SolfaName = 'C' | 'C#' | 'Db' | 'D' | 'D#' | 'Eb' | 'E' | 'F' | 'F#' | 'Gb' | 'G' | 'G#' | 'Ab' | 'A' | 'A#' | 'Bb' | 'B'


export class Solfa {

    static list: SolfaName[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
    static listFlat: SolfaName[] =['Db', 'Eb', 'Gb', 'Ab', 'Bb']
    static listSharp: SolfaName[] =['C#', 'D#', 'F#', 'G#', 'A#']
    static listWhole: SolfaName[] =['C', 'D', 'E', 'F', 'G', 'A', 'B',]
    static listAll: SolfaName[] = ['C','C#','Db','D','D#','Eb','E','F','F#','Gb','G','G#','Ab','A','A#','Bb','B']


    static flatToSharp(solfaName: SolfaName) {
        if (Solfa.listWhole.includes(solfaName)) return solfaName
        if (Solfa.listSharp.includes(solfaName)) return solfaName
        return Solfa.listSharp[
            Solfa.listFlat.indexOf(solfaName)
        ]
    }

    static sharpToFlat(solfaName: SolfaName) {
        if (Solfa.listWhole.includes(solfaName)) return solfaName
        if (Solfa.listFlat.includes(solfaName)) return solfaName
        return Solfa.listFlat[
            Solfa.listSharp.indexOf(solfaName)
        ]
    }

    static isSolfaName(str: string) {
        return (Solfa.listAll as string[]).includes(str)
    }

    static nameToNumber(solfaName: SolfaName) {
        if (!this.isSolfaName(solfaName)) return null
        return Solfa.list.indexOf(
            Solfa.sharpToFlat(solfaName)
        )
    }

    static numberToName(solfaNumber: number) {
        return Solfa.list[solfaNumber]
    }
 
    static fromName(str: string) {
        if (!Solfa.isSolfaName(str)) return null
        return new Solfa(Solfa.nameToNumber(str as SolfaName))
    }

    readonly number: number
    readonly isWholeNote: boolean
    readonly name: SolfaName


    constructor(solfaNumber: number) {
        this.number = solfaNumber

        this.isWholeNote = [0, 2, 4, 5, 7, 9, 11].includes(
            this.number
        )
        this.name = Solfa.list[this.number]
    }

    asFlat() {
        return this.name
    }

    asSharp(){
        if (this.isWholeNote) return this.name
        return Solfa.listSharp[
            Solfa.listFlat.indexOf(this.name)
        ]
    }
}




