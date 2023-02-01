import { guitarChords, ukuleleChords } from "../chords"
import { removeBrackets, removeParenthes, Score } from "./ChordMemo"

export function textToScoreSimpleNotation(text: string, line: number): Score {
    // const tmp = text.matchAll(/\S+?/g)
    const tmp = text.matchAll(/\S+/g)

    const ms = Array.from(tmp)
    const result = []
    let x = 0
    ms.map(m => {
        //     return {
        //         index: m.index,
        //         text: m[0]
        //     }
        // }).map(m => {
        const simple = m[0]


        // variation
        const vm = simple.match(/\((.*?)\)/)
        let variation = 0
        if (vm) {
            variation = Number(vm[1])
            // simple = removeParenthes(simple)
        }

        // const chord = (gctx.instrument === 'guitar' ? guitarChords : ukuleleChords).getChordByName(removeParenthes(simple))
        const chord = guitarChords.getChordByName(removeParenthes(simple))
        // let variation = 0
        if (!chord) {
            result.push({
                type: 'lyric',
                text: simple,
            })
        } else {
            result.push({
                type: 'chord',
                text: simple,
                chordName: removeBrackets(removeParenthes(simple)),
                variation: variation,
                pointer: {
                    line: line,
                    start: m.index,
                    end: m.index + simple.length
                }
            })
        }
        x = m.index + simple.length
    })

    // console.log(result)

    return result
}