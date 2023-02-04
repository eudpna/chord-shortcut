import { useEffect, useRef } from "react"
import { conf } from "../../../game/conf"
import { Gctx } from "../../../game/Gctx"
import { Klavier } from "../../../game/Klavier"
import { Pitch } from "../../../game/lib/music/Pitch"
import { hakken_width, kokken_margin } from "./KlavierEl"



export const KlavierKeyEl: React.FC<{
    gctx: Gctx
    thekey: Klavier['keys'][number]
}> = (props) => {
    const gctx = props.gctx
    const klavier = gctx.klavier
    const klavierKey = props.thekey

    const isInChordNote = gctx.audier.soundingChordNotes().map(noteNumber => new Pitch(noteNumber).solfa.number).includes(klavierKey.pitch.solfa.number)



    if (klavierKey.disabled) {
        return <div key={klavierKey.pitch.number} className="inline-block" style={{
            width: hakken_width,
            height: 130,
        }} ></div>
    }

    const isSounding = klavierKey.isDown || gctx.audier.isSoundingTheNoteAsMelody(klavierKey.pitch.number)


    return <div id={klavierKey.id} key={klavierKey.pitch.number} className={'klavierkey-el cursor-pointer ' + (klavierKey.pitch.isWholeTone ? 'flex-1 relative' : "inline-block relative")} style={klavierKey.pitch.isWholeTone ? {
        // 白鍵のスタイル
        border: 'solid 1px black',
        backgroundColor: isSounding ? conf.colors.red_dark : 'white',
        color: 'black',
    } : {
        // 黒鍵のスタイル
        border: 'solid 1px black',
        zIndex: 3,
        height: '100%',
        width: hakken_width - (kokken_margin * 2),
        marginLeft: kokken_margin,
        marginRight: kokken_margin,
        backgroundColor: isSounding ? conf.colors.red_dark : 'black',
        color: 'white',
        pointerEvents: 'auto',

    }}
        onMouseDown={() => {
            klavierKey.down()
        }}
        onMouseUp={() => {
            klavierKey.up()
        }}
        onMouseEnter={() => {
            if (!gctx.input.mouse.isDown) return
            klavierKey.down()
        }}
        onMouseLeave={() => {
            if (!gctx.input.mouse.isDown) return
            klavierKey.up()
        }}

        onTouchStart={(e) => {
            e.preventDefault()
            klavierKey.down()
        }}
        onTouchEnd={(e) => {
            e.preventDefault()
            klavierKey.up()
        }}
    >

        {klavierKey.pitch.number === 60 ?
            <div className="absolute bottom-0 px-0.5">
                C4
            </div>
        : null}

        {/* コードノートのときの丸いインジケータ */}
        {isInChordNote ?
            <div className="absolute rounded-full" style={{
                width: indicator_width,
                height: indicator_width,
                backgroundColor: conf.colors.blue_dark,
                left: hakken_width / 2 - (indicator_width / 2) - 1 + (klavierKey.pitch.isWholeTone ? 0 : -7.5),
                bottom: 20,
            }}>
            </div> : null}
    </div>
}

const indicator_width = 24
