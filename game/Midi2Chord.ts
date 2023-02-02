import {v4 as uuidv4} from 'uuid'
import { Gctx } from './Gctx'
import { removeItemAll } from './lib/array'

export class Midi2Chord {
    noteNumbers: number[]
    chordName: string
    id: string

    isDown: boolean = false

    constructor(public gctx: Gctx, noteNumbers: number[], chordName: string) {
        this.noteNumbers = noteNumbers
        this.chordName = chordName
        this.id = uuidv4()
    }

    // checkNoteOn(noteNumber: number) {
    //     if (this.isDown) return
    //     // this.gctx.klavier.keys.
    //     const arr0 = [...this.noteNumbers]
    //     const arr = [noteNumber, ...this.gctx.playingNotes.map(n => n.notenum)]
    //     arr.map(n => {
    //         removeItemAll(arr0, n)
    //     })
    //     if (arr0.length === 0) {
    //         this.down()
    //         return true
    //     }
    //     return false
    // }

    check() {
        
        const arr0 = [...this.noteNumbers]

        this.gctx.playingNotes.map(n => n.notenum)
        .map(n => {
            removeItemAll(arr0, n)
        })
        if (arr0.length === 0) {
            this.down()
        } else {
            this.up()
        }
    }

    // checkNoteOff(noteNumber: number) {

    //     if (!this.isDown) return

    //     const arr0 = [...this.noteNumbers]
    //     const arr = [...this.gctx.playingNotes.map(n => n.notenum)]
    //     removeItemAll(arr, noteNumber)
    //     arr.map(n => {
    //         removeItemAll(arr0, n)
    //     })
    //     if (arr0.length === 0) {
    //         return false
    //     }

    //     this.up()
    //     return true
    // }


    down() {
        if (this.isDown) return
        this.isDown = true
        this.gctx.playChord(this.chordName)
        this.gctx.rerenderUI()
    }

    up() {
        if (!this.isDown) return
        this.isDown = false
        this.gctx.stopChord(this.chordName)
        this.gctx.rerenderUI()
    }
}