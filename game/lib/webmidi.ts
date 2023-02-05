import webmidi, {WebMidi} from 'webmidi'
import { Gctx } from '../Gctx';


export function enableWebMidi(gctx: Gctx) {

    const noteon = (e: webmidi.NoteMessageEvent) => {
        if (!gctx.isTabVisible) return
        if (gctx.midiInput === 'off') return
        if (gctx.midiInput === 'all' || e.port === gctx.midiInput) {
            gctx.audier.playNote(e.note.number, e.note.attack)
        }
    }

    const noteoff = (e: webmidi.NoteMessageEvent) => {
        gctx.audier.stopNote(e.note.number)
    }

    const setMidiChannels = () => {
        WebMidi.inputs.map(input => {
            input.addListener("noteon", noteon);
            input.addListener("noteoff", noteoff);
        })
        gctx.rerenderUI()
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