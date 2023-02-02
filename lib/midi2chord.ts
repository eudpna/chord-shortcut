import { guitarChords } from "../game/lib/chords"
import { isNumeric } from "./lib1"



export function parseLine(line: string): [number[], string] | null {

    const m = line.match(/[^\s]+/g)

    if (!m) return null

    const arr = Array.from(m)

    if (arr.length < 2) return null

    const chordName = arr.pop()

    const noteNumbers = arr


    // chordNameのvalidation
    if (!guitarChords.getChordByName(chordName)) {
        return null
    }



    // noteNumbersのvalidation
    const noteNumbersisValid = noteNumbers.filter(noteNumber => {
        return isNumeric(noteNumber) && 0 < Number(noteNumber) && Number(noteNumber) < 128 && Number(noteNumber) % 1 === 0
    }).length === noteNumbers.length
    if (!noteNumbersisValid) return null

    
    return [noteNumbers.map(n => Number(n)), chordName]
}