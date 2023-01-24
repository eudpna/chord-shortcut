import TextareaAutosize from "react-textarea-autosize"
import { Gctx } from "../../../game/Gctx"
import { Klavier } from "../../../game/Klavier"
import { chordToName } from "../../../game/lib/chords"
import { get_diatonic_chords, isNotenumHasFlat } from "../../../game/lib/sound/scale"
import { notenumToSolfa, Solfa, solfaArr, SolfaToFlat } from "../../../game/lib/sound/solfa"

const buttonLength = [12,10]


export const ChordButtons: React.FC<{
    gctx: Gctx
}> = (props) => {
    const gctx = props.gctx
    
    const diatonic = get_diatonic_chords(gctx.key).map(c => chordToName(c))
    

    return <div className="text-sm p-0 pt-6 noselect" style={{
        marginTop: 150,
    }}>
        {diatonic.map(chordName => {

            const isSounding = gctx.isSoundingTheChord(chordName)

            return <div key={chordName} className="rounded inline-block" style={{
                width: 50,
                height: 50,
                border: 'solid 1px black',
                background: isSounding ? 'red' : 'white',
            }}>
                {chordName}
            </div>
        })}

    </div>
}






