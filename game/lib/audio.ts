import { Howl } from 'howler'
import { Pitch } from './music/Pitch';
import { SoundType } from '../Gctx';

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