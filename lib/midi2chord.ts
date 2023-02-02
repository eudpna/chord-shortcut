import { guitarChords } from "../game/lib/chords"
import { isNumeric } from "./lib1"



export function parseLine(line: string): [number[], string] | null {
    let noteNumbers = []
    let chordName = ''


    const tmp = line.split(/\s+?/)

    if (tmp.length !== 2) return null

    // chordNameのvalidation
    const t1 = tmp[1].trim()
    if (guitarChords.getChordByName(t1)) {
        chordName = t1
    } else {
        return null
    }

    const t0 = tmp[0].trim()
    if (t0.split(',').length > 1) {
        noteNumbers = t0.split(',').map(t => t.trim())
    } else {
        noteNumbers = [t0.trim()]
    }

    // noteNumbersのvalidation
    const noteNumbersisValid = noteNumbers.map(noteNumber => {
        return isNumeric(noteNumber) && 0 < noteNumber && noteNumber < 128 && Number(noteNumber) % 1 === 0
    }).length === noteNumbers.length
    if (!noteNumbersisValid) return null

    
    return [noteNumbers, chordName]
}