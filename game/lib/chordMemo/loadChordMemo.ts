import { Score } from "./ChordMemo"
import { parseChordMemoURL } from "./parseChordMemoURL"
import { textToScore } from "./textToScore"
import { textToScoreSimpleNotation } from "./textToScoreSimpleNotation"

type ChordInfo = {
    chordName: string
    count: number
}

function getChordInfo(list: ChordInfo[], chordName: string): null | ChordInfo {
    const tmp = list.filter(c => c.chordName === chordName)
    if (tmp.length === 0) return null
    return tmp[0]
}

export function loadChordMemo(chordMemoURL: string) {
    const url = parseChordMemoURL(chordMemoURL)
    if (url.text === null) return null
    if (url.text.trim() === null) return null

    const lines = url.text.trim().split('\n').map((line, i) => {
        if (url.notation === 'simple') return textToScoreSimpleNotation(line.trim(), i)
        else return textToScore(line.trim(), i)
    })
    const score = lines

    const chordList = getChordsFromScore(score)

    return chordList
    
}


function getChordsFromScore(score: Score[]) {
    const chordList: ChordInfo[] = []

    score.map(line => {
        return line.map(score => {
            if (score.type === 'chord') {
                if (!getChordInfo(chordList, score.chordName)) {
                    chordList.push({
                        chordName: score.chordName,
                        count: 0
                    })
                } else {
                    getChordInfo(chordList, score.chordName)
                    .count ++
                }
            }
        })
    })

    return chordList
}