import { format2name, guitarChords } from "../chordsdb"
import chordTranslator from "chord-translator"
import { Solfa } from "./Solfa"
import { Pitch } from "./Pitch"



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
            console.log(tmp)
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

