import webmidi, {WebMidi} from 'webmidi'
import { noteNameToNoteNumber, noteNumberToNoteName } from '../../lib/music/Pitch';
import { Gctx } from '../Gctx';
import { removeItemAll, removeItemOnce } from './array';

export function useWebMidi(gctx: Gctx) {

    const setMidiChannels = () => {
        // input
        // gctx.midiInputs = WebMidi.inputs

        WebMidi.inputs.map(input => {
            input.addListener("noteon", noteon);
            input.addListener("noteoff", noteoff);
        })

        // WebMidi.outputs.map(midi => {
        //     midi.addListener("noteon", outputNoteoff);
        //     midi.addListener("noteoff", noteoff);
        // })

        // gctx.midiInputs.map(channel => {
        //     channel.addListener("noteon", noteon);
        //     channel.addListener("noteoff", noteoff);
        // })

        // output
        // gctx.midiOutputs = WebMidi.outputs
        // gctx.midiInputs.map(channel => {
        //     channel.addListener("noteon", noteon);
        //     channel.addListener("noteoff", noteoff);
        // })


        gctx.rerenderUI()
    }

    

    const noteon = (e: webmidi.NoteMessageEvent) => {
        if (gctx.midiInput === 'off') return

        if (gctx.midiInput === 'all' || e.port === gctx.midiInput) {

            // midi2chord
            // let midi2chordActive = false
            // gctx.midi2chord.map(m => {
            //     if (m.checkNoteOn(e.note.number)) {
            //         midi2chordActive = true
            //     }
            // })
            // if (midi2chordActive) return


            // midi2chordのノートネーム入力
            // check if the textfield has focus
            const el = document.getElementById('midi2chord-input');
            const isFocused = (document.activeElement === el)
            if (isFocused) {
                const textarea: HTMLTextAreaElement = el as HTMLTextAreaElement
                const cursorPosition = textarea.selectionStart
                const txt = gctx.midi2chordText
                gctx.midi2chordText = txt.slice(0, cursorPosition) + noteNumberToNoteName(e.note.number) + ' ' + txt.slice(cursorPosition)
                gctx.rerenderUI()
                return
            }

            gctx.playNote(e.note.number, e.note.attack)

            gctx.midi2chord.map(m => {
                if (!m) return
                m.check()
            })
        }
    }

    const noteoff = (e: webmidi.NoteMessageEvent) => {
        // midi2chord
        // let midi2chordActive = false
        // gctx.midi2chord.map(m => {
        //     if (m.checkNoteOff(e.note.number)) {
        //         midi2chordActive = true
        //     }
        // })
        // if (midi2chordActive) return


        gctx.stopNote(e.note.number)

        gctx.midi2chord.map(m => {
            if (!m) return
            m.check()
        })
    }

    WebMidi.enable()
        .then(() => {
            WebMidi.addListener('portschanged', setMidiChannels)
            setMidiChannels()
        })
        .catch(err => {
            console.log(err)
        })
}


// export function midiInputIdToIndex(gctx: Gctx, midiInputId: string): number | null {
//     let result = null
//     gctx.midiInputs.forEach(midiInput => {
//         if (midiInput.id === midiInputId) {
//             result = midiInput.id
//         }
//     })
//     return result
// }