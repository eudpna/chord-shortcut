import { guitarChords } from "../chords";
import { Solfa, solfaFlatArr, SolfaToFlat } from "./solfa"

export function next_key(solfa: Solfa, n: number): string {
    const i0 = solfaFlatArr.indexOf(SolfaToFlat(solfa))
    let i = i0 + n
    if (i > solfaFlatArr.length - 1) i = i - solfaFlatArr.length
    const result = solfaFlatArr[i];
    return result
}


export function get_diatonic_chords(solfa: Solfa) {
    const ids = [
        solfa,
        next_key(solfa, 2) + 'm',
        next_key(solfa, 4) + 'm',
        next_key(solfa, 5) + 'M',
        next_key(solfa, 7) + 'M',
        next_key(solfa, 9) + 'm',
        next_key(solfa, 11) + 'dim',
    ];
    return ids.map(id => {
        return guitarChords.getChordByName(id)
    })
}

export function get_diatonic4_chords(solfa: Solfa, $key) {

    const ids = [
        solfa,
        next_key(solfa, 2) + 'm7',
        next_key(solfa, 4) + 'm7',
        next_key(solfa, 5) + 'M7',
        next_key(solfa, 7) + '7',
        next_key(solfa, 9) + 'm7',
        next_key(solfa, 11) + 'm7b5',
    ];
    return ids.map(id => {
        return guitarChords.getChordByName(id)
    })
}
