import { Scale } from "./lib/music/Scale"
import { SolfaName } from "./lib/music/Solfa"
import { chordToName, guitarChords } from "./lib/chords"

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
        
        const chord = guitarChords.getChordByName(
            Scale.romanNumericToChordName(simple, key)
        )

        
        if (!chord) {
            result.push(false)
            
        } else {
            result.push(chordToName(chord))
        }
    })
    
    return result
}