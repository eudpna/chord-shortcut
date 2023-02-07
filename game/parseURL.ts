import { SoundType } from "./Gctx"
import { Solfa, SolfaName } from "./lib/music/Solfa"
import { getUrlParameter } from "./util/other"

export type URLParameters = {
    title: string | null
    text: string | null    
    key: SolfaName | null
    // chord_sound: SoundType | null
    // melody_sound: SoundType | null
    // chord_volume: number | null
    // melody_volume: number | null
}

export function isSoundType(str: string) {
    return ['epiano', 'guitar', 'piano', 'ukulele'].includes(str)
}

export function parseURL() {
    const result: URLParameters = {
        title: null,
        text: null,
        key: null,
        // chord_sound: null,
        // melody_sound: null,
        // chord_volume: null,
        // melody_volume: null,
    }

    const title = getUrlParameter('title', location.href)
    if (title && typeof title === 'string') {
        result.title = title
    }

    const text = getUrlParameter('text', location.href)
    if (text && typeof text === 'string') {
        result.text = text
    }

    const key = getUrlParameter('key', location.href)
    if (key && typeof key === 'string' && Solfa.isSolfaName(key)
    ) {
        result.key = Solfa.sharpToFlat(key as SolfaName)
    }

    return result
}