import { Howl } from 'howler'
import { Pitch } from './music/Pitch';
import { Solfa } from './music/Solfa';
import { SoundType } from '../Gctx';

export function loadSounds(soundType: SoundType, noteNumbers: number[]) {
    noteNumbers.map(noteNumber => {
        const instrument = soundType
        const pitch = new Pitch(noteNumber)
        const filename = `${pitch.octave}${Solfa.sharpToFlat(pitch.solfa.name)}.mp3`
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
    const filename = `${pitch.octave}${pitch.solfa.name}.mp3`
    
    const howl = new Howl({
        src: [`/audios/${soundType}/${filename}`],
        volume: 0.6 * velocity,
    });
    howl.play()
    return howl
}