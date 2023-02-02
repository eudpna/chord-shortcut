import { romanNumericToChordName } from "../../lib/lib1"
import { removeParenthes } from "./chordMemo/ChordMemo"
import { chordToName, guitarChords } from "./chords"
import { Solfa } from "./sound/solfa"

export function textToChords(text: string, key: Solfa) {
    return text.split('\n').map(line => {
        return lineToChords(line, key)
    })
}

export function lineToChords(line: string, key: Solfa) {
    const tmp = line.matchAll(/\S+/g)

    const ms = Array.from(tmp)
    console.log(tmp, ms)
    const result: (string | false)[] = []

    ms.map(m => {
        const simple = m[0]
        
        const chord = guitarChords.getChordByName(
            romanNumericToChordName(simple, key)
        )

        console.log('chord is', chord)
        
        if (!chord) {
            result.push(false)
            
        } else {
            result.push(chordToName(chord))
        }
    })
    
    return result
}