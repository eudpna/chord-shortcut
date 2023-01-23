import { Gctx } from "../Gctx"
import { chordToName } from "../lib/chords"
import { isNumeric } from "../lib/lib"


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

        // 数字キーが押下されたら
        if (isNumeric(key)) {
            // 0じゃなければ
            if (key !== '0') {
                // 対応するコードを鳴らす
                gctx.playRoman(Number(key))
            }
        }

        addKey(gctx, key)
    })

    window.addEventListener('keyup', (e) => {
        const key = replaceKeyName(e.key)

        // 数字キーが離されたら
        if (isNumeric(key)) {
            // 0じゃなければ
            if (key !== '0') {
                // 対応するコードを停止
                const chord = gctx.getChordByRoman(Number(key))
                gctx.stopSound(chordToName(chord))
                gctx.playRoman(Number(key))
            }
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