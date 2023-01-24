import TextareaAutosize from "react-textarea-autosize"
import { Gctx } from "../../../game/Gctx"
import { Klavier } from "../../../game/Klavier"
import { chordToName } from "../../../game/lib/chords"
import { get_diatonic_chords, isNotenumHasFlat } from "../../../game/lib/sound/scale"
import { notenumToSolfa, Solfa, solfaArr, SolfaToFlat } from "../../../game/lib/sound/solfa"




export const ChordBtnsEl: React.FC<{
    gctx: Gctx
}> = (props) => {
    const gctx = props.gctx
    
    
    

    return <div className="p-0 pt-6 noselect" style={{
        marginTop: 150,
    }}>
        {gctx.chordBtns.btns.map((chordBtn, i) => {
            return <div key={i} className="inline-block"><div className="relative rounded inline-block" style={{
                width: 65,
                height: 50,
                border: 'solid 1px black',
                marginBottom: 40,
                marginRight: 5,
            }}>

                {/* keybind */}
                <div className="absolute text-sm text-gray rounded" style={{
                    top: -27,
                    width: '100%',
                    border: 'solid 1px #ddd',
                    color: '#555',
                }}>
                    <input type="text" className="px-1" value={chordBtn.keybind} onChange={(e) => {
                        chordBtn.keybind = e.target.value
                        gctx.chordBtns.keybindToChordName(gctx.key)
                        gctx.rerenderUI()
                    }}  style={{
                        width: '100%'

                        }}/>
                </div>


                <div className="absolute inset-0 text-center font-bold" style={{
                    top: 10
                }}>
                    {chordBtn.chordName ? chordBtn.chordName : ''}
                </div>


                {/* qwerty */}
                <div className="text-xs text-gray absolute" style={{
                    left: 2,
                    bottom: 2
                }}>
                    {chordBtn.qwerty}
                </div>
                
            </div>
                {i === 9 ? <br /> : null}
            </div>
        })

        }
        {/* {diatonic.map(chordName => {

            const isSounding = gctx.isSoundingTheChord(chordName)

            return <div key={chordName} className="rounded inline-block" style={{
                width: 50,
                height: 50,
                border: 'solid 1px black',
                background: isSounding ? 'red' : 'white',
            }}>
                {chordName}
            </div>
        })} */}

    </div>
}






