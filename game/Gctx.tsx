import sanitize from "sanitize-filename"
import { removeItemOnce } from "./lib/array"
import { ChordData, chordToName, guitarChords } from "./lib/chords"
import { copyToClipboard, downloadText, getUrlParameter, strSplice, Vec2 } from "./lib/lib"
import { Score, ScoreElementChord, textToScore, textToScoreSimpleNotation } from "./lib/score"
import { get_diatonic_chords } from "./lib/sound/scale"
import { Solfa, solfaWholeArr } from "./lib/sound/solfa"
import { playSounds } from "./lib/sound/sound"
import { Howl } from 'howler'
import { setKeyEventListeners } from "./input/key"

export type SoundType = 'guitar' | 'ukulele' | 'piano' | 'epiano' 

export type playingChord = {
    chordName: string
    audios: Howl[]
}

export type PlayingNote = {
    notenum: number,
    audio: Howl,
}

// ユーザー入力に関する状態データ
export class InputState {
    touched_point: Vec2 | null = null
    mouse_pointer: Vec2 | null = null
    // 押されているキー
    keys: string[] = []
}

type Keybind = {
    qwerty: string,
    notenum: number
}

const qwerty1 = [
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L'
]

const qwerty1Flatify = {
    'A': 'Q',
    'S': 'W',
    'D': 'E',
    'F': 'R',
    'G': 'T',
    'H': 'Y',
    'J': 'U',
    'K': 'I',
    'L': 'O',
}




export class Gctx {
    key: Solfa = 'C'
    // playingChords: string[] = []

    // ユーザー入力に関する状態データ
    input = new InputState

    noteRange = {
        start: 48
    }

    keybinds: Keybind[] = []

    playingChords: playingChord[] = []
    playingNotes: PlayingNote[] = []

    constructor(public rerenderUI: Function) {
        setKeyEventListeners(this)
        this.makeKeybinds()
        rerenderUI()
    }

    makeKeybinds() {
        const tmp = []
        qwerty1.map((q, i) => {
            // flatが存在するなら
            if ([1,2,4,5,6].includes(i % 7)) {
                tmp.push(qwerty1Flatify[q])
            }
            tmp.push(q)
        })
        const keybinds = tmp.map((q,i) => {
            return {
                qwerty: q,
                notenum: this.noteRange.start+i,
            }
        })
        console.log(keybinds)
        this.keybinds = keybinds
    }

    // ノートを再生
    playNote(notenum: number) {
        this.playSounds([notenum])
            .then((howlers) => {
                this.playingNotes.push({
                    notenum: notenum,
                    audio: howlers[0],
                })
                setTimeout(() => {
                    removeItemOnce(this.playingNotes, notenum)
                    this.rerenderUI()
                }, 3000);
            })
        this.playingNotes.push()
    }

    // 再生中のノートを停止
    stopNote(notenum: number) {
        this.playingNotes.forEach(playingNote => {
            if (playingNote.notenum=== notenum) {
                playingNote.audio.stop()
                removeItemOnce(this.playingNotes, playingNote)
            }
        })
    }

    qwertyKeyToNotenum(qwerty: string) {
        const tmp = this.keybinds.filter(keybind => keybind.qwerty === qwerty)
        if (tmp.length === 0) return null
        return tmp[0].notenum
    }

    // 再生中のコード音声を停止
    stopChord(chordName: string) {
        this.playingChords.forEach(playingChord => {
            if (playingChord.chordName === chordName) {
                playingChord.audios.forEach(audio => {
                    audio.stop()
                })
                removeItemOnce(this.playingChords, playingChord)
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
        
        
        this.rerenderUI()
        this.playSounds(chord.positions[0].midi)
            .then((howlers) => {
                this.playingChords.push({
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
        return playSounds('piano', keyIds)
    }
}