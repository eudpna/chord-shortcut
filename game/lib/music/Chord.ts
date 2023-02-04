import { guitarChords } from "../chordsdb"


// コードの抽象化。現状、内部には @tombatossals/chords-db を使用している。
export class Chord {
    readonly name: string
    readonly key: string
    readonly suffix: string
    readonly notes: number[]

    constructor(name: string) {
        if (!Chords.exists(name)) return null
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

