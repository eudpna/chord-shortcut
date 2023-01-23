import { Gctx } from "../Gctx"
import { chordToName } from "../lib/chords"
import { isNumeric, isRoman, keyToRoman } from "../lib/lib"
import { notenumToSolfa } from "../lib/sound/solfa"


// export function keysToInput(gctx: Gctx) {
//     const keys = gctx.input.keys
//     if (keys.includes('left')) {
//         gctx.input.direction.x = -1
//     }
//     if (keys.includes('right')) {
//         gctx.input.direction.x = 1
//     }
//     if ((!keys.includes('left') && !keys.includes('right')) || (keys.includes('left') && keys.includes('right'))) {
//         gctx.input.direction.x = 0
//     }
// }

export function setKeyEventListeners(gctx: Gctx) {
    window.addEventListener('keydown', (e) => {
        const key = replaceKeyName(e.key)

        // 数字キーが押下され　　かつ
        // すでに押されていなければ
        if (isRoman(key)
            && !gctx.input.keys.includes(key)
        ) {
            // 対応するコードを鳴らす
            gctx.playRoman(keyToRoman(key))
        }


        // 存在するキーを押下したら　かつ
        // 既に押されていなかったら
        if (gctx.keybinds.map(keybind => keybind.qwerty.toLowerCase()).includes(key) &&
        !gctx.input.keys.includes(key)) {
            console.log(key, gctx.qwertyKeyToNotenum(key.toUpperCase()), notenumToSolfa(gctx.qwertyKeyToNotenum(key.toUpperCase())))
            // 対応するノートを鳴らす
            gctx.playNote(
                gctx.qwertyKeyToNotenum(key.toUpperCase())
            )
        }


        addKey(gctx, key)
    })

    window.addEventListener('keyup', (e) => {
        const key = replaceKeyName(e.key)

        // 数字キーが離されたら
        if (isRoman(key)
        ) {
            // 対応するコードを停止
            const chord = gctx.getChordByRoman(keyToRoman(key))
            gctx.stopChord(chordToName(chord))
        }

        // 存在するキーを離したら
        if (gctx.keybinds.map(keybind => keybind.qwerty.toLowerCase()).includes(key)) {
            // 対応するノートを停止
            gctx.stopNote(
                gctx.qwertyKeyToNotenum(key.toUpperCase())
            )
        }

        removeKey(gctx, key)
    })
}

function replaceKeyName(k: string): string {
    let key = k.toLowerCase()
    return key
}


function addKey(gctx: Gctx, key: string) {
    if (gctx.input.keys.includes(key)) return
    gctx.input.keys.push(key)
}

function removeKey(gctx: Gctx, key: string) {
    gctx.input.keys = gctx.input.keys.filter(k => k !== key)
}