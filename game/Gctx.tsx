import sanitize from "sanitize-filename"
import { removeItemOnce } from "./lib/array"
import { ChordData, chordToName, guitarChords } from "./lib/chords"
import { copyToClipboard, downloadText, getUrlParameter, strSplice, Vec2 } from "./lib/lib"
import { Score, ScoreElementChord, textToScore, textToScoreSimpleNotation } from "./lib/score"
import { get_diatonic_chords } from "./lib/sound/scale"
import { Solfa, solfaFlatArr, solfaWholeArr } from "./lib/sound/solfa"
import { playSounds } from "./lib/sound/sound"
import { Howl } from 'howler'
import { setKeyEventListeners } from "./input/key"
import { Klavier } from "./Klavier"
import { setMouseEventListeners } from "./input/mouse"

export type SoundType = 'guitar' | 'ukulele' | 'piano' | 'epiano' 

export type playingChord = {
    chordName: string
    audios: Howl[]
}

export type PlayingNote = {
    notenum: number,
    audio: Howl,
}


export type Mouse = {
    pointer: Vec2 | null
    isDown: boolean
}

// ユーザー入力に関する状態データ
export class InputState {
    mouse: Mouse = {
        pointer: null,
        isDown: false,
    }
    
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
    
    klavier: Klavier = new Klavier(48+7, 10)
    noteRange = {
        // chromatic
        start: 48+7,
        // 全音で数える
        length: 10,
    }

    keybinds: Keybind[] = []

    fadeChordSound = true

    soundTypes: {
        chord: SoundType
        melody: SoundType
    } = {
        chord: 'guitar',
        melody: 'epiano'
    }

    playingChords: playingChord[] = []
    playingNotes: PlayingNote[] = []

    // piano: Piano = {
    //     keysDown: []
    // }

    constructor(public rerenderUI: Function) {
        setKeyEventListeners(this)
        setMouseEventListeners(this)
        this.makeKeybinds()
        rerenderUI()
    }

    makeKeybinds() {


        if (!solfaWholeArr.includes(solfaFlatArr[this.noteRange.start % 12])) throw Error(`qwertyの2段目の左端(キーボードのA)が黒鍵 ${solfaFlatArr[this.noteRange.start % 12]} です`)
        
        const keybinds = []
        let j = this.noteRange.start
        qwerty1.map((q, i) => {

            // i0は[A]の度数
            const i0 = solfaWholeArr.indexOf(solfaFlatArr[this.noteRange.start % 12])
            // ddは[今のsolfa]の度数
            const dd = i0 + i
            console.log('i0:', i0, ' dd:', dd, ' i:', i)
            // flatが存在するなら
            if ([1,2,4,5,6].includes(dd % 7)) {
                console.log('flatが存在します')
                keybinds.push({
                    qwerty: qwerty1Flatify[q],
                    notenum: j + (i === 0 ? -1 : 0)
                })
                if (i !== 0) j++
            }
            keybinds.push({
                qwerty: q,
                notenum: j
            })
            j++
        })


        console.log(keybinds)
        this.keybinds = keybinds
    }

    // ノートを再生
    playNote(notenum: number) {
        this.playSounds([notenum], this.soundTypes.melody)
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
    fadeChord(chordName: string) {
        const duration = 300
        this.playingChords.forEach(playingChord => {
            if (playingChord.chordName === chordName) {
                playingChord.audios.forEach(audio => {
                    const tmp = audio.volume()
                    audio.fade(tmp, 0, duration)
                    setTimeout(() => {
                        audio.stop()
                        audio.volume(tmp)
                    }, duration);
                })
                removeItemOnce(this.playingChords, playingChord)
            }
        })
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
        this.playSounds(chord.positions[0].midi, this.soundTypes.chord)
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


    playSounds(keyIds: number[], soundType: SoundType) {
        return playSounds(soundType, keyIds)
    }
}