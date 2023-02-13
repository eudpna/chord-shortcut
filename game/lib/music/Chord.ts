import { format2name, guitarChords } from "../chordsdb"
import chordTranslator from "chord-translator"
import { Solfa, SolfaName } from "./Solfa"
import { Pitch } from "./Pitch"
import { getDegreeFromNumber, romanNumberList } from "./Degree"



// コードの抽象化。現状、内部には @tombatossals/chords-db を使用している。
export class Chord {
    readonly name: string
    readonly key: string
    readonly suffix: string
    readonly notes: number[]

    constructor(name0: string) {
        const name = format2name(name0)
        if (!Chords.exists(name)) {
            // コード名が chords-db に存在しなかったら chord-translator を使用
            const tmp = Solfa.listAll.filter(solfa => name.startsWith(solfa))
            if (!tmp.length) return null
            const solfa = tmp[0]
            const root = solfa
            const suffix = name.slice(solfa.length)
            const notes = chordTranslator(root, suffix)
            if (!notes) return null

            this.name = name
            this.key = solfa
            this.suffix = suffix
            this.notes = notes.map(note => Pitch.nameToNumber(note))
            return this
        }


        const tmchord = guitarChords.getChordByName(name)
        this.name = name
        this.key = tmchord.key
        this.suffix = tmchord.suffix
        this.notes = tmchord.positions[0].midi
    }


    getDegree(note: Pitch): string {
        const n0 = Solfa.fromName(this.key).number
        const n1 = note.solfa.number

        let nd = n1 - n0
        if (nd < 0) nd = nd + 12
        nd = nd % 12 


        // 特殊なディグリー
        if (nd === 2 && this.suffix.includes('9')) return '9'
        if (nd === 2 && this.suffix.includes('2')) return '2'
        if (nd === 5 && this.suffix.includes('4')) return '4'
        if (nd === 5 && this.suffix.includes('11')) return '11'
        if (nd === 9 && this.suffix.includes('6')) return '6'
        if (nd === 9 && this.suffix.includes('13')) return '13'

        const degree = getDegreeFromNumber(nd)

        if (!degree) return null

        return degree.name
    }

    toRomanNumeric(key: Solfa) {

        const n0 = key.number
        const n1 = Solfa.fromName(this.key).number

        let nd = n1 - n0
        if (nd < 0) nd = nd + 12
        nd = nd % 12 
        
        const suffix = this.suffix === 'M' ? '' : this.suffix

        return romanNumberList[nd] + suffix
        
    }
}

export class Chords {
    static exists(name: string) {
        return !!guitarChords.getChordByName(name)
    }

    static byName(name: string) {
        return new Chord(name)
    }

    static byKey(key: string) {
        return guitarChords.getChordsByKey(key).map(tmchord => {
            return new Chord(tmchord.key + tmchord.suffix)
        })
    }

    static bySuffix(suffix: string) {
        return guitarChords.getChordsBySuffix(suffix).map(tmchord => {
            return new Chord(tmchord.key + tmchord.suffix)
        })
    }
}

