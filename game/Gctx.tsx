import sanitize from "sanitize-filename"
import { removeItemOnce } from "./lib/array"
import { ChordData, chordToName, guitarChords } from "./lib/chords"
import { copyToClipboard, downloadText, getUrlParameter, strSplice, Vec2 } from "./lib/lib"
import { Score, ScoreElementChord, textToScore, textToScoreSimpleNotation } from "./lib/score"
import { get_diatonic_chords } from "./lib/sound/scale"
import { Solfa } from "./lib/sound/solfa"
import { playSounds } from "./lib/sound/sound"
import { Howl } from 'howler'
import { setKeyEventListeners } from "./input/key"

export type SoundType = 'guitar' | 'ukulele' | 'piano' | 'epiano' 

export type PlayingAudio = {
    chordName: string
    audios: Howl[]
}

// ユーザー入力に関する状態データ
export class InputState {
    touched_point: Vec2 | null = null
    mouse_pointer: Vec2 | null = null
    // 押されているキー
    keys: string[] = []
}




export class Gctx {
    key: Solfa = 'C'
    playingChords: string[] = []

    // ユーザー入力に関する状態データ
    input = new InputState
    playingAudios: PlayingAudio[] = []

    constructor(public rerenderUI: Function) {
        setKeyEventListeners(this)
        rerenderUI()
    }

    // 再生中のコード音声を停止
    stopSound(chordName: string) {
        this.playingAudios.forEach(playingAudio => {
            if (playingAudio.chordName === chordName) {
                playingAudio.audios.forEach(audio => {
                    audio.stop()
                })
                removeItemOnce(this.playingAudios, playingAudio)
            }
        })
    }

    playRoman(n: number) {
        this.playChord(
            chordToName(
                this.getChordByRoman(n)
            )    
        )
    }

    getChordByRoman(n: number) {
        return this.getDiatonicChords()[n]
    }

    getDiatonicChords() {
        return get_diatonic_chords(this.key)
    }

    playChord(chordName: string) {

        const chord = guitarChords.getChordByName(chordName)

        this.playingChords.push(chordName)
        
        this.rerenderUI()
        this.playSounds(chord.positions[0].midi)
            .then((howlers) => {
                this.playingAudios.push({
                    chordName: chordName,
                    audios: howlers
                })
                setTimeout(() => {
                    removeItemOnce(this.playingChords, chord)
                    this.rerenderUI()
                }, 3000);
            })
    }


    playSounds(keyIds: number[]) {
        return playSounds('guitar', keyIds)
    }
}