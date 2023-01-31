import webmidi, {WebMidi} from 'webmidi'
import { Gctx } from '../Gctx';

export function useWebMidi(gctx: Gctx) {

    WebMidi.enable()
        .then(() => {
            // Display available MIDI input devices
            // if (WebMidi.inputs.length < 1) {
            //     console.log('No device detected.')
            //     document.body.innerHTML += "No device detected.";
            // } else {
            //     WebMidi.inputs.forEach((device, index) => {
            //         console.log(`${index}: ${device.name}`)
            //     });
            // }

            const noteon = (e: webmidi.NoteMessageEvent) => {
                gctx.playNote(e.note.number, e.note.attack)
            }

            const noteoff = (e: webmidi.NoteMessageEvent) => {
                gctx.stopNote(e.note.number)
            }

            WebMidi.addListener('portschanged', () => {
                gctx.midiInputs = WebMidi.inputs
                
                const channel = WebMidi.inputs[gctx.midiChannels.input]

                channel.addListener("noteon", noteon);
                channel.addListener("noteoff", noteoff);

            })

            // const mySynth = WebMidi.inputs[0];
            // const mySynth = WebMidi.getInputByName("TYPE NAME HERE!")



        })
        .catch(err => {
            console.log(err)
        })
}
