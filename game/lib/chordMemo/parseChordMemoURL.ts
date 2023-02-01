import { getUrlParameter, isNumeric } from "../../../lib/lib1"


export type URLParameters = {
    title: string | null
    text: string | null
    instrument: 'guitar' | 'ukulele' | null
    columns: number | null
    notation: 'simple' | 'lyric' | null
}

export function parseChordMemoURL(url: string) {
    const result: URLParameters = {
        title: null,
        text: null,
        instrument: null,
        columns: null,
        notation: null,
    }

    const title = getUrlParameter('title', url)
    if (title && typeof title === 'string') {
        result.title = title
    }

    const text = getUrlParameter('text', url)
    if (text && typeof text === 'string') {
        result.text = text
    }

  

    const instrument = getUrlParameter('instrument', url)
    if (instrument && typeof instrument === 'string') {
        if (instrument === 'ukulele' || this.instrument === 'guitar') {
            result.instrument = instrument as URLParameters['instrument']
        }
    }

    const notation = getUrlParameter('notation', url)
    if (notation && typeof notation === 'string') {
        if (notation === 'simple') {
            result.notation = notation as URLParameters['notation']
        }
    }

    const columns = getUrlParameter('columns', url)
    if (title && typeof columns === 'string' &&
        isNumeric(columns)
    ) {
        const col = Number(columns)
        if (col % 1 === 0 && col > 0 && col < 5) {
            result.columns = col
        }
    }

    return result

}