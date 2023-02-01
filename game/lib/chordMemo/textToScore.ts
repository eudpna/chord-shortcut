import { removeBrackets, removeParenthes, Score } from "./ChordMemo"

export function textToScore(text: string, line: number): Score {
    const tmp = text.matchAll(/\[.*?\]/g)

    const ms = Array.from(tmp)
    const result = []
    let x = 0
    ms.map(m => {
        return {
            index: m.index,
            text: m[0]
        }
    }).map(m => {
        const lyric = text.substring(x, m.index)
        let chordText = text.substring(m.index, m.index + m.text.length)

        // variation
        const vm = chordText.match(/\((.*?)\)/)
        let variation = 0
        let chordName = chordText
        if (vm) {
            variation = Number(vm[1])
            chordName = removeParenthes(chordText)
        }
        chordName = removeBrackets(chordName)

        if (lyric.trim() !== '') {
            result.push({
                type: 'lyric',
                text: lyric,
            })
        }
        result.push({
            type: 'chord',
            text: chordText,
            chordName: chordName,
            variation: variation,
            pointer: {
                line: line,
                start: m.index,
                end: m.index + m.text.length
            }
        })
        x = m.index + m.text.length
    })
    const lyric = text.substring(x, text.length)
    if (lyric.trim() !== '') {
        result.push({
            type: 'lyric',
            text: lyric,
        })
    }


    return result
}
