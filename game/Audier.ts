import { Howl } from "howler"
import { conf } from "./conf"
import { Gctx } from "./Gctx"
import { playNote } from "./lib/audio"
import { Chords } from "./lib/music/Chord"
import { removeItemOnce } from "./util/array"

export type playingChord = {
    chordName: string
    audios: Howl[]
}

export type PlayingNote = {
    noteNumber: number,
    audio: Howl,
}


export class Audier {
    playing: {
        melody: PlayingNote[]
        chords: playingChord[]
    } = {
        melody: [],
        chords: [],
    }

    gctx: Gctx

    constructor(gctx: Gctx) {
        this.gctx = gctx
    }

    playNote(note: number, velocity: number = 0.5) {

        if (!this.gctx.isTabVisible) return

        const vel = velocity * (this.gctx.audioVolume.melody / conf.maxAudioVolume)

        const audio = playNote(this.gctx.soundTypes.melody, note, vel)
        this.playing.melody.push({
            noteNumber: note,
            audio
        })

        this.gctx.sendMidiNoteOn('melody', note, velocity)
        this.gctx.rerenderUI()
    }

    playChord(chordName: string, velocity: number = 0.5) {

        if (!this.gctx.isTabVisible) return

        
        const chord = Chords.byName(chordName)
        if (!chord) return

        const vel = velocity * (this.gctx.audioVolume.chord / conf.maxAudioVolume)

        const audios = chord.notes.map(note => {
            this.gctx.sendMidiNoteOn('chord', note)
            return playNote(this.gctx.soundTypes.chord, note, vel)
        })
        this.playing.chords.push({
            chordName: chordName,
            audios,
        })
        this.gctx.rerenderUI()
    }


    // コードとして鳴っているコードノートの一覧を取得
    soundingChordNotes(): number[] {
        return this.playing.chords.flatMap(playingChord => {
            return Chords.byName(playingChord.chordName).notes
        })
    }

    // 再生中のノートを停止
    stopNote(note: number) {
        const duration = this.gctx.fadeDuration.melody
        this.playing.melody.forEach(playingNote => {
            if (playingNote.noteNumber === note) {
                const audio = playingNote.audio
                const tmp = audio.volume()
                audio.fade(tmp, 0, duration)
                setTimeout(() => {
                    audio.stop()
                    audio.volume(tmp)
                }, duration);
                removeItemOnce(this.playing.melody, playingNote)

                // midi output
                this.gctx.sendMidiNoteOff('melody', note)
            }
        })
        this.gctx.rerenderUI()
    }


    // 再生中のコード音声を停止
    stopChord(chordName: string) {
        const duration = this.gctx.fadeDuration.chord
        this.playing.chords.forEach(playingChord => {
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
                        this.gctx.sendMidiNoteOff('chord', noteNumber)
                    })
                })
                removeItemOnce(this.playing.chords, playingChord)
            }
        })
        this.gctx.rerenderUI()
    }


    // 特定のコードが鳴っているか
    isSoundingTheChord(chordName: string) {
        return this.playing.chords.filter(chord => chord.chordName === chordName).length > 0
    }

    // 特定のノートが(メロディとして)鳴っているか
    isSoundingTheNoteAsMelody(noteNumber: number) {
        return this.playing.melody.filter(note => note.noteNumber === noteNumber).length > 0
    }
}