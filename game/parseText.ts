import { Scale } from "./lib/music/Scale"
import { Solfa, SolfaName } from "./lib/music/Solfa"
import { chordToName, guitarChords } from "./lib/chordsdb"
import { Chord, Chords } from "./lib/music/Chord"

export function parseText(text: string, key: SolfaName) {
    return text.split('\n').map(line => {
        return lineToChords(line, key)
    })
}


function lineToChords(line: string, key: SolfaName) {
    const tmp = line.matchAll(/\S+/g)

    const ms = Array.from(tmp)
    
    const result: (string | false)[] = []

    ms.map(m => {
        const simple = m[0]
        
        // const chord = guitarChords.getChordByName(
        //     Scale.romanNumericToChordName(simple, key)
        // )
        const name = Scale.romanNumericToChordName(simple, Solfa.fromName(key))

        const chord = Chords.byName(name)

        
        if (!chord) {
            result.push(false)
        } else {
            result.push(chord.name)
        }
    })
    
    return result
}