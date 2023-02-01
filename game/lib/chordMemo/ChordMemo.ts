export type ScoreElement = ScoreElementChord | ScoreElementLyric



export type ScoreElementChord = {
    type: 'chord'
    text: string
    chordName: string
    variation: number
    // textの位置
    pointer: {
        line: number
        start: number
        end: number
    }
}

export type ScoreElementLyric = {
    type: 'lyric'
    text: string
}

export type Score = ScoreElement[]


export function removeParenthes(text: string) {
    const m = text.match(/\(.*?\)/)
    if (m) {
        return text.replace(m[0], '')
    }
    return text
}
export function removeBrackets(text: string) {
    return text.replaceAll('[', '')
        .replaceAll(']', '')
        .replaceAll('(', '')
        .replaceAll(')', '')
    // const m = text.match(/\[.*?\]/)
    // if (m) {
    //     return text.replace(m[0], '')
    // }
    // return text
}


