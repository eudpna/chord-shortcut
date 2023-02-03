import { useEffect } from "react"
import { useRef } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { conf } from "../../../game/conf"
import { Gctx } from "../../../game/Gctx"
import { Klavier } from "../../../game/Klavier"
import { ChordBtn } from "../../../game/lib/ChordBtns"
import { chordToName } from "../../../game/lib/chords"
import { get_diatonic_chords, isNotenumHasFlat } from "../../../game/lib/sound/scale"
import { notenumToSolfa, Solfa, solfaArr, SolfaToFlat } from "../../../game/lib/sound/solfa"


export const ChordBtnEl: React.FC<{
    gctx: Gctx
    chordBtn: ChordBtn
}> = (props) => {
    const gctx = props.gctx
    const chordBtn = props.chordBtn
    const ref = useRef(null)

    useEffect(() => {
        if (ref) {
            chordBtn.ref = ref
            gctx.rerenderUI()
        }
        return () => {
            chordBtn.ref = null
        };
    }, [ref]);

    const isSounding = chordBtn.isDown || gctx.isSoundingTheChord(chordBtn.chordName)


    return <div
        id={chordBtn.id}
        ref={ref}
        className="chordbtn-el inline-block">
        <div className="relative rounded inline-block cursor-pointer" style={{
            
            width: 65,
            height: 50,
            border: 'solid 1px black',
            marginBottom: 16,
            marginRight: 5,
            // backgroundColor: chordBtn.isDown ? 'red' : (gctx.isSoundingTheChord(chordBtn.chordName) ? 'blue' : 'white'),
            backgroundColor: isSounding ? conf.colors.blue_dark : 'white'
        }}
            onMouseDown={() => {
                chordBtn.down()
            }}
            onMouseUp={() => {
                chordBtn.up()
            }}
            onMouseEnter={() => {
                if (!gctx.input.mouse.isDown) return
                chordBtn.down()
            }}
            onMouseLeave={() => {
                if (!gctx.input.mouse.isDown) return
                chordBtn.up()
            }}

            onTouchStart={(e) => {
                e.preventDefault()
                chordBtn.down()
            }}
            onTouchEnd={(e) => {
                e.preventDefault()
                chordBtn.up()
            }}
        >

            {/* keybind */}
            {/* <div className="absolute text-sm text-gray rounded" style={{
                top: -27,
                width: '100%',
                border: 'solid 1px #ddd',
                color: '#555',
            }}>
                <input type="text" className="px-1" value={chordBtn.chordNameInput} onChange={(e) => {
                    chordBtn.chordNameInput = e.target.value
                    // gctx.chordBtns.make()
                    gctx.rerenderUI()
                }} style={{
                    width: '100%'

                }} />
            </div> */}


            {/* コード名 */}
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
        {/* {i === 9 ? <br /> : null} */}
    </div>
}


export const ChordBtnsEl: React.FC<{
    gctx: Gctx
}> = (props) => {
    const gctx = props.gctx

    const bs = gctx.chordBtns.btns

    const btns = [
        bs.slice(0, 10),
        bs.slice(10, 20),
        bs.slice(20, 30),
        bs.slice(30, 40),
    ]

    return <div className="p-0 noselect" style={{
        // marginTop: 150,
        // overflowX: 'hidden',
        whiteSpace: 'nowrap',
    }}>
        {btns.map((line, i) => <div key={i} style={{
            height: 70
        }}>
                {line.map((chordBtn, i) => {
                    return <div key={i} className="inline-block">
                        <ChordBtnEl
                            gctx={gctx}
                            chordBtn={chordBtn}
                        />
                    </div>
                })}
            </div>
        )}
        {/* {gctx.chordBtns.btns.map((chordBtn, i) => {
            return <div key={i} className="inline-block">
                <ChordBtnEl
                gctx={gctx}
                chordBtn={chordBtn}
                 />
            </div>
        })} */}
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






