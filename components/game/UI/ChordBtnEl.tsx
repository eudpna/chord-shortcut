import { useEffect } from "react"
import { useRef } from "react"
import { ChordBtn } from "../../../game/ChordBtn"
import { conf } from "../../../game/conf"
import { Gctx } from "../../../game/Gctx"


export const ChordBtnEl: React.FC<{
    gctx: Gctx
    chordBtn: ChordBtn
    index: number
}> = (props) => {
    const gctx = props.gctx
    const chordBtn = props.chordBtn

    const isSounding = chordBtn.isDown || gctx.audier.isSoundingTheChord(chordBtn.chordName)

    const ref = useRef()
    useEffect(() => {
        // console.log('ref is', ref.current)
        if (!ref.current) return
        chordBtn.el = ref.current
    }, [ref])

    return <div
        ref={ref}
        id={chordBtn.id}
        className="chordBtn chordbtn-el inline-block">
        <div className="relative rounded inline-block cursor-pointer" style={{
            width: 65,
            height: 50,
            border: 'solid 1px black',
            marginBottom: 16,
            marginRight: 5,
            backgroundColor: isSounding ? conf.colors.gray_light : 'white'
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

            // onTouchStart={(e) => {
            //     chordBtn.down()
            // }}
            // onTouchEnd={(e) => {
            //     console.log('chordbtn touchend')
            //     chordBtn.up()
            // }}
        >

            {/* コード名 */}
            <div className="absolute inset-0 text-center font-bold" style={{
                // top: 10,
                lineHeight: '46px',
                fontSize: (chordBtn.chordName && chordBtn.chordName.length > 5) ? `${1-(chordBtn.chordName.length-5)*0.1}rem` :  '1rem'
            }}>
                {chordBtn.chordName ? chordBtn.chordName : ''}
            </div>


            {/* qwerty */}
            {(gctx.keyboardToPiano && props.index >= 20) ? null :
            <div className="text-xs text-gray absolute" style={{
                left: 2,
                bottom: 2
            }}>
                {chordBtn.qwerty}
            </div>}

        </div>
    </div>
}
