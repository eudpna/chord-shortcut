import { qwerty } from "./util/other"
import { setKeyEventListeners } from "./input/key"
import { Klavier } from "./Klavier"
import { setMouseEventListeners } from "./input/mouse"
import { ChordBtns } from "./ChordBtns"
import { ResourceLoader } from "./lib/ResourceLoader"
import audioList from '../script/resource/audioList.json'
import webmidi, {WebMidi} from 'webmidi'
import { conf } from "./conf"
import { Solfa, SolfaName } from "./lib/music/Solfa"
import { enableWebMidi } from "./lib/webmidi"
import { parseURL } from "./parseURL"
import { Scale } from "./lib/music/Scale"
import { Vec2 } from "./util/math"
import { parseText } from "./parseText"
import { Audier } from "./Audier"
import { Chords } from "./lib/music/Chord"
import { setTouchEventListeners } from "./input/touch"
import { Rect } from "./lib/math"




export type SoundType = 'guitar' | 'ukulele' | 'piano' | 'epiano' 




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
        chord: Math.floor(conf.maxAudioVolume * 0.7),
        melody: Math.floor(conf.maxAudioVolume * 0.8),
    }

    midiInput: webmidi.Input | 'off' | 'all' = 'all'
    midiOutput: webmidi.Output | 'off' = 'off'

    text: string = ''

    title: string = ''

    key: SolfaName = 'C'

    input = new InputState

    klavier: Klavier = new Klavier(this, 22, 108 - 22)

    chordBtns: ChordBtns = new ChordBtns(this)

    soundTypes: {
        chord: SoundType
        melody: SoundType
    } = {
        chord: 'piano',
        melody: 'epiano'
    }

    fadeDuration = {
        chord: 200,
        melody: 200,
    }

    audier = new Audier(this)

    resourceLoader = new ResourceLoader()

    loadedPercentage: number = 0


    isTabVisible: boolean = true

    rerenderUI: Function

    keyboardToPiano: boolean = false


    constructor(rerenderUI: Function) {
   
        this.rerenderUI = () => {
            this.updateURL()
            rerenderUI()
        }


        setKeyEventListeners(this)
        setMouseEventListeners(this)
        setTouchEventListeners(this)
        
        this.startCheckingIfTabVisible()

        this.loadURL()
        this.setQwertyToChordBtns()

        this.loadInstrumentAudio()
        
        enableWebMidi(this)
        rerenderUI()
    }

    loadInstrumentAudio() {
        audioList.filter(src => {
            return src.includes(this.soundTypes.chord) || src.includes(this.soundTypes.melody)
        }).map(src => {
            this.resourceLoader.load(src, 'audio', (resource, percent) => {
                this.loadedPercentage = percent
                this.rerenderUI()
            })
        })
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
    
    setKey(key: SolfaName) {
        this.key = key
        this.make()
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
            // `&chord_sound=${encodeURIComponent(this.soundTypes.chord)}` +
            // `&melody_sound=${encodeURIComponent(this.soundTypes.melody)}` +
            // `&chord_volume=${encodeURIComponent(this.audioVolume.chord)}` +
            // `&melody_volume=${encodeURIComponent(this.audioVolume.melody)}`
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

        return `?title=${encodeURIComponent(this.title.trim())}` +
            `&text=${encodeURIComponent(this.getRomanNumericText())}` +
            `&key=${encodeURIComponent(this.key)}`
    }

    startCheckingIfTabVisible() {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.isTabVisible = false
            }
            else {
                this.isTabVisible = true
            }
        }, false);
    }

    getRomanNumericURL() {
        return location.href.replace(location.search, '') +
            `?title=${encodeURIComponent(this.title.trim())}` +
            `&text=${encodeURIComponent(this.getRomanNumericText())}` +
            '&notation=simple'
    }


    getRomanNumericText() {
        const chordNames: (string | null)[] = []

        this.chordBtns.btns.flatMap(s => s)
            .map(chordBtn => {
                const s = chordBtn.chordName
                if (s) {
                    const tmp = Chords.byName(s).toRomanNumeric(Solfa.fromName(this.key))
                    
                    chordNames.push(
                        tmp
                    )
                } else {
                    chordNames.push('')
                }
            })
        let text = ''
        let count = 1
        chordNames.map(chordName => {
            text = text + chordName + ' '
            if (count % 10 === 0) {
                text = text + '\n'
            }
            count++
        })
        text = text.trim()


        return text
    }
}

