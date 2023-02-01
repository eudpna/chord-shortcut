import webmidi, {WebMidi} from 'webmidi'
import { Gctx } from '../Gctx';

export function useWebMidi(gctx: Gctx) {

    const setMidiChannels = () => {
        gctx.midiInputs = WebMidi.inputs

        // let index = midiInputIdToIndex(gctx, gctx.midiChannels.input)
        // if (!index) index = 0

        // const channel = WebMidi.inputs[index]
        // console.log(channel)

        // console.log('midiInputs is', gctx.midiInputs)

        gctx.midiInputs.map(channel => {
            channel.addListener("noteon", noteon);
            channel.addListener("noteoff", noteoff);
        })

        gctx.rerenderUI()
    }

    const noteon = (e: webmidi.NoteMessageEvent) => {
        // console.log('channel is', e.target, gctx.getMidiInputChannel())
        // console.log(e, e.target)
        if (gctx.selectedMidiInput === 'off') return
        
        if (gctx.selectedMidiInput === 'all' || e.port === gctx.selectedMidiInput) {
            gctx.playNote(e.note.number, e.note.attack)
        }
        // if (e.target === gctx.getMidiInputChannel()) {
        //     // console.log('yeah')
        //     gctx.playNote(e.note.number, e.note.attack)
        // }
        // if (gctx.midiChannels.input = e.channel)
        
    }

    const noteoff = (e: webmidi.NoteMessageEvent) => {
        // console.log('heee')
        gctx.stopNote(e.note.number)
    }

    WebMidi.enable()
        .then(() => {

            WebMidi.addListener('portschanged', setMidiChannels)

            setMidiChannels()

            // const mySynth = WebMidi.inputs[0];
            // const mySynth = WebMidi.getInputByName("TYPE NAME HERE!")

        })
        .catch(err => {
            console.log(err)
        })
}


export function midiInputIdToIndex(gctx: Gctx, midiInputId: string): number | null {
    let result = null
    gctx.midiInputs.forEach(midiInput => {
        if (midiInput.id === midiInputId) {
            result = midiInput.id
        }
    })
    return result
}