import { isNotenumHasFlat, notenumListWhole } from "./lib/sound/scale"

export type KlavierKey = {
    readonly notenum: number
    readonly isBlack: boolean
    isDown: number
}

export class Klavier {

    keys: KlavierKey[] = []

    // startNoteNumとlengthは全音(白鍵)
    constructor(public startNoteNum: number, public length: number) {
        console.log(startNoteNum, length)
        const keys = []
        for (let i = 0; i < length; i ++) {
            const index = notenumListWhole.indexOf(startNoteNum)
            const notenum = notenumListWhole[index + i]
            console.log(index, notenum)
            // フラット(黒鍵)がある場合それを追加
            // ただし左端の白鍵のときは無視
            if (i !== 0 && isNotenumHasFlat(notenum)) {
                keys.push({
                    notenum: notenum-1,
                    isBlack: true,
                    isDown: 0,
                })  
            }
            // 白鍵
            keys.push({
                notenum: notenum,
                isBlack: false,
                isDown: 0,
            })
        }
        this.keys = keys
        console.log(keys)
    }
}
