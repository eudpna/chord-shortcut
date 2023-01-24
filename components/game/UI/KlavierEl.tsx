import TextareaAutosize from "react-textarea-autosize"
import { Gctx } from "../../../game/Gctx"
import { isNotenumHasFlat } from "../../../game/lib/sound/scale"
import { notenumToSolfa, Solfa, solfaArr, SolfaToFlat } from "../../../game/lib/sound/solfa"


const hakken_width = 500
const kokken_margin = 8


export const KlavierEl: React.FC<{
    gctx: Gctx
}> = (props) => {
    const gctx = props.gctx
    const klavier = gctx.klavier

    const kokken_num = klavier.keys.filter(key => key.isBlack).length
    const hakken_num = klavier.keys.filter(key => !key.isBlack).length

    return <div className="text-sm p-0 pt-6" style={{
        marginTop: 150,
    }}>


        {/* 白鍵 */}
        <div className="flex" style={{
            height: 200,
            width: hakken_width,
            zIndex: 0,
            // backgroundColor: 'blue',
        }}>
            {klavier.keys.map(key => {
                if (key.isBlack) return null
                return <div key={key.notenum} className="flex-1" style={{
                    border: 'solid 1px black',
                }}>
                    {notenumToSolfa(key.notenum)}
                </div>
            })}
        </div>

        {/* 黒鍵 */}
        <div className="" style={{
            height: 130,
            
            zIndex: 2,
            marginTop: -200,
            marginLeft: hakken_width/hakken_num/2
            // background: 'red'
        }}>
            {klavier.keys.map(key => {
                if (!key.isBlack) {
                    if (isNotenumHasFlat(key.notenum)) {
                        return null
                    } else {
                        return <div key={key.notenum} className="inline-block" style={{
                            width: hakken_width / hakken_num
                        }} ></div>
                    }
                }
                return <div key={key.notenum} className="inline-block" style={{
                    border: 'solid 1px black',
                    zIndex: 3,
                    height: '100%',
                    width: hakken_width / hakken_num - (kokken_margin*2),
                    marginLeft: kokken_margin,
                    marginRight: kokken_margin,
                    backgroundColor: 'black',
                    color: 'white',

                }}>
                    {notenumToSolfa(key.notenum)}
                </div>
            })}
        </div>

    </div>
}