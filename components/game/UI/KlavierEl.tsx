import { useEffect, useRef } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { conf } from "../../../game/conf"
import { Gctx } from "../../../game/Gctx"
import { Klavier } from "../../../game/Klavier"
import { Pitch } from "../../../lib/music/Pitch"

const hakken_width = 46

const kokken_margin = 7.5





export const KlavierEl: React.FC<{
    gctx: Gctx
}> = (props) => {
    const gctx = props.gctx
    const klavier = gctx.klavier
    const hakken_num = klavier.keys.filter(key => key.pitch.isWholeTone).length


    return <div className="text-sm p-0 noselect" style={{}}>


        {/* 白鍵 */}
        <div className="flex" style={{
            height: 200,
            width: hakken_width * hakken_num,
            zIndex: 0,
        }}>
            {klavier.keys.map(key => {
                if (!key.pitch.isWholeTone) return null
                return <KlavierKeyEl gctx={gctx} thekey={key} key={key.pitch.noteNumber} />
            })}
        </div>

        {/* 黒鍵 */}
        <div className="flex" style={{
            height: 130,
            pointerEvents: 'none',
            width: hakken_width * hakken_num * 2,
            zIndex: 2,
            marginTop: -200,
            marginLeft: -hakken_width/2
        }}>
            {klavier.keys.map(klavierKey => {
                if (klavierKey.pitch.isWholeTone) {
                    if (klavierKey.pitch.hasFlat()) {
                        return null
                    } 
                    return <div key={klavierKey.pitch.noteNumber} className="inline-block" style={{
                        width: hakken_width,
                        height: 130,
                    }} ></div>
                }
                return <KlavierKeyEl gctx={gctx} thekey={klavierKey} key={klavierKey.pitch.noteNumber} />
            })}
        </div>

    </div>
}










export const KlavierKeyEl: React.FC<{
    gctx: Gctx
    thekey: Klavier['keys'][number]
}> = (props) => {
    const gctx = props.gctx
    const klavier = gctx.klavier
    // const kokken_num = klavier.keys.filter(key => key.pitch.iswh).length
    // const hakken_num = klavier.keys.filter(key => !key.isBlack).length
    const klavierKey = props.thekey

    // const colorOn = '#fbb'

    // 押されている　または その音が鳴っている
    // const isDown = klavierKey.isDown || gctx.isSoundingTheNote(klavierKey.noteNumber)


    // const isInChordNote = gctx.soundingNoteAsChord().includes(klavierKey.pitch.noteNumber)

    const isInChordNote = gctx.soundingNoteAsChord().map(noteNumber => new Pitch(noteNumber).solfa.solfaNumber).includes(klavierKey.pitch.solfa.solfaNumber)
    // .includes(klavierKey.pitch.noteNumber)


    const ref = useRef(null)

    useEffect(() => {
        if (ref) {
            klavierKey.ref = ref
            gctx.rerenderUI()
        }
        return () => {
            klavierKey.ref = null
        };
    }, [ref]);

    
    if (klavierKey.disabled) {
        return <div key={klavierKey.pitch.noteNumber} className="inline-block" style={{
            width: hakken_width,
            height: 130,
        }} ></div>
    }

    const isSounding = klavierKey.isDown || gctx.isSoundingTheNote(klavierKey.pitch.noteNumber)
    

    return <div id={'#klavierKey-'+klavierKey.id} key={klavierKey.pitch.noteNumber} className={'cursor-pointer '+(klavierKey.pitch.isWholeTone ? 'flex-1 relative' : "inline-block relative")} style={klavierKey.pitch.isWholeTone ? {
        // 白鍵のスタイル
        border: 'solid 1px black',
        // backgroundColor: klavierKey.isDown ? 'red' : (gctx.isSoundingTheNote(klavierKey.pitch.noteNumber) ? 'blue' : 'white'),
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
        // backgroundColor: klavierKey.isDown ? 'red' : (gctx.isSoundingTheNote(klavierKey.pitch.noteNumber) ? 'blue' : 'black'),
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
        {/* 名前 */}
        {/* {klavierKey.pitch.solfa.solfaName} */}

        {/* qwerty */}
        <div className="text-xs text-gray absolute" style={{
            left: 2,
            bottom: 2
        }}>
            {klavierKey.qwerty}
        </div>

        

        {/* コードノートのときの丸いインジケータ */}
        {isInChordNote ? 
        <div className="absolute rounded-full" style={{
            width: indicator_width,
            height: indicator_width,
            backgroundColor: conf.colors.blue_dark,
            // left: (hakken_width)/2 - 10 + (klavierKey.pitch.isWholeTone ? -9 : -1),
            left: hakken_width/2-(indicator_width/2)-1,
            bottom: 20,
        }}> 
        </div>  : null}
    </div>

}

const indicator_width = 24