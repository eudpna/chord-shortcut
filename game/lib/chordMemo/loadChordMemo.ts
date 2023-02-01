import { Score } from "./ChordMemo"
import { parseChordMemoURL } from "./parseChordMemoURL"
import { textToScore } from "./textToScore"
import { textToScoreSimpleNotation } from "./textToScoreSimpleNotation"

export function loadChordMemo(chordMemoURL: string): null | string[] {
    const url = parseChordMemoURL(chordMemoURL)
    if (url.text === null) return null

    const lines = url.text.trim().split('\n').map((line, i) => {
        if (url.notation === 'simple') return textToScoreSimpleNotation(line.trim(), i)
        else return textToScore(line.trim(), i)
    })
    const score = lines

    const chordList = getChordsFromScore(score)

    console.log(chordList)

    return chordList
    
}


function getChordsFromScore(score: Score[]): string[] {
    const chordList: string[] = []

    score.map(line => {
        return line.map(score => {
            if (score.type === 'chord') {
                if (!chordList.includes(score.chordName)) {
                    chordList.push(score.chordName)
                }
            }
        })
    })

    return chordList
}