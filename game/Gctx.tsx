import { removeItemOnce } from "./util/array"
import { qwerty } from "./util/other"
import { Howl } from 'howler'
import { setKeyEventListeners } from "./input/key"
import { Klavier } from "./Klavier"
import { setMouseEventListeners } from "./input/mouse"
import { ChordBtns } from "./ChordBtns"
import { ResourceLoader } from "./lib/ResourceLoader"
import audioList from '../script/resource/audioList.json'
import webmidi, {WebMidi} from 'webmidi'
import { playNote } from "./lib/audio"
import { conf } from "./conf"
import { SolfaName } from "./lib/music/Solfa"
import { enableWebMidi } from "./lib/webmidi"
import { parseURL } from "./parseURL"
import { Scale } from "./lib/music/Scale"
import { Vec2 } from "./util/math"
import { parseText } from "./parseText"
import { Chords } from "./lib/music/Chord"




export type SoundType = 'guitar' | 'ukulele' | 'piano' | 'epiano' 

export type playingChord = {
    chordName: string
    audios: Howl[]
}

export type PlayingNote = {
    noteNumber: number,
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





export class Gctx {

    // 設定
    audioVolume: {
        master: number
        chord: number
        melody: number
    } = {
        master: Math.floor(conf.maxAudioVolume * 0.8),
        chord: Math.floor(conf.maxAudioVolume * 0.8),
        melody: Math.floor(conf.maxAudioVolume * 0.8),
    }

    midiInput: webmidi.Input | 'off' | 'all' = 'all'
    midiOutput: webmidi.Output | 'off' = 'off'

    text: string = ''

    title: string = ''

    undoText: string | null = null

    chordSortMethod: 'appearance' | 'frequency' = 'appearance'

    isLoadedChordMemo: boolean = false

    key: SolfaName = 'C'

    // ユーザー入力に関する状態データ
    input = new InputState

    klavier: Klavier = new Klavier(this, 22, 108 - 22)

    chordBtns: ChordBtns = new ChordBtns(this)

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

    rerenderUI: Function

    constructor(rerenderUI: Function) {

        this.rerenderUI = () => {
            this.updateURL()
            rerenderUI()
        }

        setKeyEventListeners(this)
        setMouseEventListeners(this)

        this.loadURL()
        this.setQwertyToChordBtns()

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
        enableWebMidi(this)
        rerenderUI()
    }

    loadURL() {
        const url = parseURL()

        if (url.title !== null) {
            this.title = url.title
        }
        if (url.text !== null) {
            this.setText(url.text)
        }
        if (url.key !== null) {
            this.key = url.key
        }
        this.make()
        this.rerenderUI()
    }

 

    setText(text: string) {
        this.text = text
        this.make()
        this.rerenderUI()
    }


    make() {
        this.chordBtns.clear()

        const lines = parseText(this.text, this.key)
        
        const bs = this.chordBtns.btns
        const btns = [
            bs.slice(0, 10),
            bs.slice(10, 20),
            bs.slice(20, 30),
            bs.slice(30, 40),
        ]
        
        lines.slice(0, 4).map((line, i) => {
            line.slice(0, 10).map((chord, j) => {
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

    setDiatonic() {
        this.setText(
            Scale.diatonic.join(' ') + '\n' +
            Scale.diatonic4.join(' ')
        )
     }
    
    setKey(key: SolfaName) {
        this.key = key
        this.setDiatonic()
        this.rerenderUI()
    }

    setQwertyToChordBtns() {
        const qwert = qwerty.common
        
        // コードにキーを割り当て
        let count = 0
        for (let j = 0; j < qwert.length; j ++) {
            for (let i = 0; i < qwert[j].length; i ++) {
                this.chordBtns.btns[count].qwerty = qwert[j][i].toLocaleLowerCase()
                count++
            }
        }
        this.rerenderUI()
        return
    }

    // コードとして鳴っているコードノートの一覧を取得
    soundingChordNotes(): number[] {
        return this.playingChords.flatMap(playingChord => {
            return Chords.byName(playingChord.chordName).notes
        })
    }

    // 特定のコードが鳴っているか
    isSoundingTheChord(chordName: string) {
        return this.playingChords.filter(chord => chord.chordName === chordName).length > 0
    }

    // 特定のノートが(メロディとして)鳴っているか
    isSoundingTheNote(noteNumber: number) {
        return this.playingNotes.filter(note => note.noteNumber===noteNumber).length > 0
    }

    // ノートを再生(メロディとして)
    playNote(noteNumber: number, velocity: number = 0.5) {
        const howl = playNote(this.soundTypes.melody, noteNumber, velocity * (this.audioVolume.master / conf.maxAudioVolume) * (this.audioVolume.melody / conf.maxAudioVolume))

        const playingNote = {
            noteNumber: noteNumber,
            audio: howl,
        }
        this.playingNotes.push(playingNote)
        this.rerenderUI()
        setTimeout(() => {
            removeItemOnce(this.playingNotes, playingNote)
            this.rerenderUI()
        }, 3000);

        // midi output
        this.sendMidiNoteOn('melody', noteNumber, velocity)

        this.rerenderUI()
    }

    // 再生中のノートを停止
    stopNote(noteNumber: number) {
        const duration = this.fadeDuration.melody
        this.playingNotes.forEach(playingNote => {
            if (playingNote.noteNumber=== noteNumber) {
                const audio = playingNote.audio
                const tmp = audio.volume()
                audio.fade(tmp, 0, duration)
                setTimeout(() => {
                    audio.stop()
                    audio.volume(tmp)
                }, duration);
                removeItemOnce(this.playingNotes, playingNote)

                // midi output
                this.sendMidiNoteOff('melody', noteNumber)
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

                    // midi output
                    Chords.byName(playingChord.chordName).notes.forEach(noteNumber => {
                        this.sendMidiNoteOff('chord', noteNumber)
                    })
                })
                removeItemOnce(this.playingChords, playingChord)
            }
        })
        this.rerenderUI()
    }

    playChord(chordName: string) {
        if (!chordName) return

        const chord = Chords.byName(chordName)

        if (!chord) return

        const howlers = chord.notes.map(noteNumber => {
            // midi output
            this.sendMidiNoteOn('chord', noteNumber)

            return playNote(this.soundTypes.chord, noteNumber, 0.5 * (this.audioVolume.master/conf.maxAudioVolume)*(this.audioVolume.chord/conf.maxAudioVolume))
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

    // midiの入出力がループになっているか
    isMidiLoop() {
        if (this.midiOutput === 'off') return false
        if (this.midiInput === 'off') return false
        if (this.midiInput === 'all') {
            return WebMidi.inputs.filter(input => {
                return input.name === (this.midiOutput as webmidi.Output).name
            }).length > 0
        }
        return this.midiInput.name === (this.midiOutput as webmidi.Output).name
    }


    sendMidiNoteOn(channel: 'chord' | 'melody',  noteNumber: number, velocity: number = 0.5) {
        const channelNum = channel === 'chord' ? 2 : 1;

        if (this.midiOutput === 'off') return
        if (this.isMidiLoop()) return 

        this.midiOutput.sendNoteOn(noteNumber, {
            channels: [channelNum],
            attack: velocity
        })
    }

    sendMidiNoteOff(channel: 'chord' | 'melody', noteNumber: number) {
        const channelNum = channel === 'chord' ? 2 : 1;

        if (this.midiOutput === 'off') return
        if (this.isMidiLoop()) return 

        this.midiOutput.stopNote(noteNumber, {
            channels: [channelNum],
        })
    }


    getURL() {
        return location.href.replace(location.search, '') +
            `?title=${encodeURIComponent(this.title.trim())}` +
            `&text=${encodeURIComponent(this.text)}` +
            `&key=${encodeURIComponent(this.key)}`
    }

    updateURL() {
        if (location.href === this.getURL()) return
        history.replaceState(null, null, this.getURL())
    }

    getChordMemoURL() {
        let text = ''
        this.chordBtns.btns.map((btn,i) => {
            if (btn.chordName)  {
                text = text + btn.chordName + ' '
            }
            if ((i + 1) % 10 === 0) {
                text = text + '\n'
            }
        })
        text = text.trim()

        return `https://chordmemo.nyaw.net/` +
            `?title=${encodeURIComponent(this.title.trim())}` +
            `&text=${encodeURIComponent(text)}` +
            '&notation=simple'
    }
}

