var fs = require('fs');
var path = require('path');
const { execSync } = require('child_process')
import { Pitch } from '../../game/lib/music/Pitch'

const pianoMP3NoteDuration = 3


main('piano.mp3', 'piano')

function main(filename:string, dirname:string) {

    const inputFile = path.join(process.cwd(), `/mp3/${filename}`)
    
    const Ids = Array.from(Array(108-21+1).keys())
    
    Ids.map(id => {
        const pitch = new Pitch(id+21)
        // const note = keyIdToNote(id+21)
        const startSec = id * pianoMP3NoteDuration

        const output = pitch.octave + pitch.solfa.name + '.mp3'

        execSync(`ffmpeg -i ${inputFile} -ss ${startSec} -t ${pianoMP3NoteDuration} -acodec copy ${path.join(process.cwd(),`../../public/audios/${dirname}/`,output)} -y`)


    })
}

