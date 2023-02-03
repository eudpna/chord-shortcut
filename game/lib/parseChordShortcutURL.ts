import { SolfaName } from "../../lib/music/Solfa"
import { getUrlParameter } from "./lib"
import { solfaArr, SolfaToFlat } from "./sound/solfa"

export type URLParameters = {
    title: string | null
    text: string | null    
    key: SolfaName | null
}

export function parseChordShortcutURL() {
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

    // const text1 = getUrlParameter('text1', location.href)
    // if (text1 && typeof text1 === 'string') {
    //     result.text1 = text1
    // }

    const key = getUrlParameter('key', location.href)
    if (key && typeof key === 'string' && 
    solfaArr.includes(key)
    ) {
        result.key = SolfaToFlat(key as SolfaName)
    }



    return result

}