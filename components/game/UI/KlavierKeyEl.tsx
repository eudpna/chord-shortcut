import { useEffect, useRef } from "react"
import { conf } from "../../../game/conf"
import { Gctx } from "../../../game/Gctx"
import { setTouchEventListeners } from "../../../game/input/touch"
import { Klavier } from "../../../game/Klavier"
import { Chords } from "../../../game/lib/music/Chord"
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

    const ref = useRef()
    useEffect(() => {
        if (!ref.current) return
        klavierKey.el = ref.current
        const el = ref.current as HTMLDivElement
        el.addEventListener('touchstart', (e) => {
            e.preventDefault()
            e.stopPropagation()
            klavierKey.down()
        }, { passive: false })
        el.addEventListener('touchend', (e) => {
            e.preventDefault()
            e.stopPropagation()
           klavierKey.up()
        }, { passive: false })
    }, [ref])


    if (klavierKey.disabled) {
        return <div key={klavierKey.pitch.number} className="inline-block" style={{
            width: hakken_width,
            height: 130,
        }} ></div>
    }

    const isSounding = klavierKey.isDown || gctx.audier.isSoundingTheNoteAsMelody(klavierKey.pitch.number)


    return <div
        ref={ref}
        id={klavierKey.id} key={klavierKey.pitch.number} className={'klavierKey klavierkey-el cursor-pointer ' + (klavierKey.pitch.isWholeTone ? 'flex-1 relative' : "inline-block relative")} style={klavierKey.pitch.isWholeTone ? {
            // 白鍵のスタイル
            border: 'solid 1px black',
            backgroundColor: isSounding ? conf.colors.red_dark : 'white',
            // backgroundColor: klavierKey.isDown ? 'green' : (isSounding ? conf.colors.red_dark : 'white'),
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
    >


        {klavierKey.pitch.number === 60 ?
            <div className="absolute bottom-0 px-0.5">
                C4
            </div>
            : null}

        {/* qwerty */}
        {gctx.keyboardToPiano && klavierKey.pitch.number !== 60 ?
            <div className="text-xs text-gray absolute" style={{
                left: 2,
                bottom: 2
            }}>
                {klavierKey.qwerty}
            </div> : null}

        {/* コードノートのときの丸いインジケータ */}
        {isInChordNote ?
            <div className="absolute rounded-full" style={{
                width: indicator_width,
                height: indicator_width,
                backgroundColor: klavierKey.pitch.isWholeTone ? conf.colors.gray_light : conf.colors.gray_dark,
                left: hakken_width / 2 - (indicator_width / 2) - 1 + (klavierKey.pitch.isWholeTone ? 0 : -7.5),
                bottom: 20,
                pointerEvents: 'none',
            }}>
            </div> : null}

        {/* ディグリー */}
        {isInChordNote ? (() => {
            const tmp = gctx.audier.playing.chords
            if (tmp.length !== 1) return null
            const chord = Chords.byName(tmp[0].chordName)
            const degree = chord.getDegree(klavierKey.pitch)
            if (!degree) return null
            return <div className="absolute rounded-full text-center" style={{
                fontSize: '1rem',
                width: indicator_width,
                height: indicator_width,
                lineHeight: indicator_width + 'px',
                color: 'white',
                // backgroundColor: conf.colors.blue_dark,
                left: hakken_width / 2 - (indicator_width / 2) - 1 + (klavierKey.pitch.isWholeTone ? 0 : -7.5),
                bottom: 20,
                pointerEvents: 'none',
            }}>
                {degree}
            </div>
        })() : null}
        
    </div>
}

// const indicator_width = 24
const indicator_width = 30
