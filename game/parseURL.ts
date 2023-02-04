import { Solfa, SolfaName } from "./lib/music/Solfa"
import { getUrlParameter } from "./util/other"

export type URLParameters = {
    title: string | null
    text: string | null    
    key: SolfaName | null
}

export function parseURL() {
    const result: URLParameters = {
        title: null,
        text: null,
        key: null,
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