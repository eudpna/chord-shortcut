import sanitize from "sanitize-filename"
import { removeItemOnce } from "./lib/array"
import { ChordData, chordToName, guitarChords } from "./lib/chords"
import { copyToClipboard, downloadText, getUrlParameter, qwerty, strSplice, Vec2 } from "./lib/lib"
import { get_diatonic_chords } from "./lib/sound/scale"
import { Solfa, solfaFlatArr, solfaWholeArr } from "./lib/sound/solfa"
import { Howl } from 'howler'
import { setKeyEventListeners } from "./input/key"
import { Klavier } from "./Klavier"
import { setMouseEventListeners } from "./input/mouse"
import { ChordBtns } from "./lib/ChordBtns"
import { ResourceLoader } from "../lib/ResourceLoader"

import audioList from '../script/resource/audioList.json'
import { Pitch } from "../lib/music/Pitch"
import webmidi, {WebMidi} from 'webmidi'
import { midiInputIdToIndex, useWebMidi } from "./lib/midi"
import { playNote } from "./lib/sound/sound"
import { parseChordMemoURL } from "./lib/chordMemo/parseChordMemoURL"
import { loadChordMemo } from "./lib/chordMemo/loadChordMemo"
import { textToChords } from "./lib/textToChords"
import { diatonic } from "../lib/lib1"
import { conf } from "./conf"

// import tonal from 'tonal'
// import {Chord} from 'tonal'

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
    midiInputs: webmidi.Input[] = []

    audioVolume: {
        master: number
        chord: number
        melody: number
    } = {
        master: 4,
        chord: 4,
        melody: 4,
    }

    selectedMidiInput: webmidi.Input | 'off' | 'all' = 'all'

    chordMemoURL: string = ''

    text: string = ''

    undoText: string | null = null

    chordSortMethod: 'appearance' | 'frequency' = 'appearance'

    // midiChannels: {
    //     input: string
    //     output: string
    // } = {
    //     input: '',
    //     output: '',
    // }
    
    key: Solfa = 'C'
    // playingChords: string[] = []

    // ユーザー入力に関する状態データ
    input = new InputState
    
    // klavier: Klavier = new Klavier(this, 48 + 7, 10)
    klavier: Klavier = new Klavier(this, 22, 108 - 22)

    chordBtns: ChordBtns = new ChordBtns(this)

    qwertyLang: 'jis' | 'us'

    fadeChordSound = true

    soundTypes: {
        chord: SoundType
        melody: SoundType
    } = {
        chord: 'epiano',
        melody: 'epiano'
    }

    fadeDuration = {
        chord: 200,
        melody: 200,
    }

    playingChords: playingChord[] = []
    playingNotes: PlayingNote[] = []

    resourceLoader = new ResourceLoader()

    loadedPercentage: number = 0
    showLoadingProgress = true

    // piano: Piano = {
    //     keysDown: []
    // }

    constructor(public rerenderUI: Function) {
        setKeyEventListeners(this)
        setMouseEventListeners(this)
        this.setDiatonic()
        // this.chordBtns.setDiatonic()
        this.setQwertyLang('us')

        audioList.map(src => {
            this.resourceLoader.load(src, 'audio', (resource, percent) => {
                this.loadedPercentage = percent
                if (percent === 100) {
                    this.showLoadingProgress = false
                    this.rerenderUI()
                }
                this.rerenderUI()
            })
        })
        
        useWebMidi(this)


        rerenderUI()
    }

 

    setText(text: string) {
        this.text = text
        this.make()
        this.rerenderUI()
    }

    make() {
        this.chordBtns.clear()

        const lines = textToChords(this.text, this.key)
        console.log(lines)
        const bs = this.chordBtns.btns
        const btns = [
            bs.slice(0, bs.length / 2),
            bs.slice(bs.length/2, bs.length)
        ]
        lines[0]
        lines.slice(0, 2).map((line, i) => {
            line.map((chord, j) => {
                if (typeof chord === 'string') {
                    btns[i][j].chordName = chord
                }
            })
        })
        this.rerenderUI()
    }

    undo() {
        this.setText(
            this.undoText
        )

        this.undoText = null
        this.rerenderUI()
    }

    getMidiInputById(id: string): webmidi.Input | null {
        let result: webmidi.Input = null
        this.midiInputs.forEach(midiInput => {
            if (midiInput.id === id) {
                result = midiInput
            }
        })
        return result
    }

    // getMidiInputChannel() {
    //     return this.midiInputs[
    //         midiInputIdToIndex(this, this.midiChannels.input)
    //     ]
    // }

    loadChordMemo() {
        const chordInfos = loadChordMemo(this.chordMemoURL)

        if (chordInfos === null) return

        if (this.chordSortMethod === 'frequency') {
            chordInfos.sort((a, b) => {
                return b.count - a.count
            })
        }

        const chordNames = chordInfos.map(c => c.chordName)

        

        // chordNames.join(' ')

        this.undoText = this.text

        this.setText(
            chordNames.join(' ')
        )
        // this.chordBtns.setChordNameList(chordNames)

        // this.rerenderUI()
    }

    // isChordMemoURLValid(): boolean {
    //     return true
    // }

    setDiatonic() {
            // setDiatonic() {
        const chordNames = []
        for (let i = 0; i < 7; i ++) {
            chordNames.push(diatonic[i])
            // this.btns[i].chordNameInput = diatonic[i]
            // this.make()
        }

        this.setText(
            chordNames.join(' ') + '\n\n' + this.text
        )
        
     }

    setKey(key: Solfa) {
        this.key = key
        // this.chordBtns.setDiatonic()
        this.setDiatonic()
        this.rerenderUI()
    }


    qwerty() {
        return qwerty[this.qwertyLang]
    }

    setQwertyLang(qwertyLang: this['qwertyLang']) {
        this.qwertyLang = qwertyLang
        
        // コードにキーを割り当て
        for (let i = 0; i < 10; i++) {
            const q = this.qwerty()[0][i]
            this.chordBtns.btns[i].qwerty = q.toLowerCase()
        }
        for (let i = 0; i < 10; i++) {
            const q = this.qwerty()[3][i]
            this.chordBtns.btns[10+i].qwerty = q.toLowerCase()
        }


        // ノートにキーを割り当て
        const startNote = 48+7        
        const whiteKeys = this.klavier.keys.filter(key => key.pitch.isWholeTone)
        const dan = [1,2]
        let j = startNote
        for (let i = 0; i < whiteKeys.length && i < this.qwerty()[dan[0]].length && i < this.qwerty()[dan[1]].length; i++) {
            if (!(new Pitch(j).isWholeTone)) j ++
            const key = this.klavier.getKeyByNoteNunber(j)
            if (!key) {
                break
            }
            // 白鍵だったら
            if (key.pitch.isWholeTone) {
                key.qwerty = this.qwerty()[dan[1]][i].toLowerCase()
                // その左上に黒鍵があったら
                if (key.pitch.hasFlat()) {
                    const blackKey = this.klavier.getKeyByNoteNunber(key.pitch.noteNumber - 1)
                    if (blackKey) {
                        blackKey.qwerty = this.qwerty()[dan[0]][i].toLowerCase()
                    }
                }
            }
            j++
        }
        
        this.rerenderUI()
    }

    // コードとして鳴っているコードノートの一覧を取得
    soundingNoteAsChord(): number[] {
        return this.playingChords.flatMap(chord => {
            return guitarChords.getChordByName(chord.chordName).positions[0].midi
        })
    }

    // 特定のコードが鳴っているか
    isSoundingTheChord(chordName: string) {
        return this.playingChords.filter(chord => chord.chordName === chordName).length > 0
    }

    // 特定のノートが(メロディとして)鳴っているか
    isSoundingTheNote(notenum: number) {
        return this.playingNotes.filter(note => note.notenum===notenum).length > 0
    }

    // ノートを再生(メロディとして)
    playNote(noteNumber: number, velocity: number = 0.5) {
        console.log(this.audioVolume)
        const howl = playNote(this.soundTypes.melody, noteNumber, velocity * (this.audioVolume.master / conf.maxAudioVolume) * (this.audioVolume.melody / conf.maxAudioVolume))

        const playingNote = {
            notenum: noteNumber,
            audio: howl,
        }
        this.playingNotes.push(playingNote)
        this.rerenderUI()
        setTimeout(() => {
            removeItemOnce(this.playingNotes, playingNote)
            this.rerenderUI()
        }, 3000);

        this.rerenderUI()
    }

    // 再生中のノートを停止
    stopNote(notenum: number) {
        const duration = this.fadeDuration.melody
        this.playingNotes.forEach(playingNote => {
            if (playingNote.notenum=== notenum) {
                const audio = playingNote.audio
                const tmp = audio.volume()
                audio.fade(tmp, 0, duration)
                setTimeout(() => {
                    audio.stop()
                    audio.volume(tmp)
                }, duration);
                removeItemOnce(this.playingNotes, playingNote)
            }
        })
        this.rerenderUI()
    }


    // 再生中のコード音声を停止
    stopChord(chordName: string) {
        const duration = this.fadeDuration.chord
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
        this.rerenderUI()
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


        if (!chordName) return


        // console.log(tonal.Chord.getChord(chordName).notes)

        const chord = guitarChords.getChordByName(chordName)

        if (!chord) return

        const howlers = chord.positions[0].midi.map(noteNumber => {
            return playNote(this.soundTypes.chord, noteNumber, 0.3 * (this.audioVolume.master/conf.maxAudioVolume)*(this.audioVolume.chord/conf.maxAudioVolume))
        })
    
        const playingChord = {
            chordName: chordName,
            audios: howlers
        }
        this.playingChords.push(playingChord)
        this.rerenderUI()
        setTimeout(() => {
            removeItemOnce(this.playingChords, playingChord)
            this.rerenderUI()
        }, 3000);
    
        this.rerenderUI()


    }




    // playSounds(keyIds: number[], soundType: SoundType) {
    //     return playSounds(soundType, keyIds)
    // }
}

