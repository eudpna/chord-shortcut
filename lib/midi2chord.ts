import { guitarChords } from "../game/lib/chords"
import { isNumeric } from "./lib1"
import { noteNameToNoteNumber } from "./music/Pitch"



export function parseLine(line: string): [number[], string] | null {

    const m = line.match(/[^\s]+/g)

    if (!m) return null

    const arr = Array.from(m)

    if (arr.length < 2) return null

    const arr1 = arr.pop()

    const arr0 = arr


    // chordNameのvalidation
    if (!guitarChords.getChordByName(arr1)) {
        return null
    }



    // noteNumbersのvalidation
    let invalid = false
    const arr01 = arr0.map(a => {
        if (!isNumeric(a)) {
            const t0 = noteNameToNoteNumber(a)
            if (t0 === null) invalid = true
            else {
                return t0
            }
        } else {
            if (0 < Number(a) && Number(a) < 128 && Number(a) % 1 === 0) {
                return Number(a)
            }
            else {
                invalid = true
            }
        }
    })
    if (invalid) return null
    
    return [arr01, arr1]
}