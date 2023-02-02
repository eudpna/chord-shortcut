import { Howl } from 'howler'
import { Pitch } from '../../../lib/music/Pitch';
import { SoundType } from '../../Gctx';
import { keyidToPitch } from "./keyIdToPitch";
import { SolfaToFlat } from "./solfa";

export function loadSounds(soundType: SoundType, keyIDs: number[]) {
    keyIDs.map(keyID => {
        const pitch = keyidToPitch(keyID)
        const instrument = soundType
        const filename = `${pitch.octave}${SolfaToFlat(pitch.solfa)}.mp3`
        const audio = new Howl({
            src: [`/audios/${instrument}/${filename}`],
            volume: 0.6,
        });
        if (audio.state() === 'loaded') return
        else audio.load()
    })
}

export function playNote(soundType: SoundType, noteNumber: number, velocity: number) {
    const pitch = new Pitch(noteNumber)
    const filename = `${pitch.octave}${pitch.solfa.solfaName}.mp3`
    console.log('vel is', velocity)
    const howl = new Howl({
        src: [`/audios/${soundType}/${filename}`],
        volume: 0.6 * velocity,
    });
    howl.play()
    return howl
}