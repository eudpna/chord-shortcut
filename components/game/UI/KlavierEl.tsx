import { Gctx } from "../../../game/Gctx"
import { KlavierKeyEl } from "./KlavierKeyEl"

export const hakken_width = 46
export const hakken_height = 200
export const kokken_margin = 7.5

export const KlavierEl: React.FC<{
    gctx: Gctx
}> = (props) => {
    const gctx = props.gctx
    const klavier = gctx.klavier
    const hakken_num = klavier.keys.filter(key => key.pitch.isWholeTone).length

    return <div className="text-sm p-0 noselect" style={{
        marginLeft: -800,
        height: hakken_height,
    }}>

        {/* 白鍵 */}
        <div className="flex" style={{
            height: hakken_height,
            width: hakken_width * hakken_num,
            zIndex: 0,
        }}>
            {klavier.keys.map(key => {
                if (!key.pitch.isWholeTone) return null
                return <KlavierKeyEl gctx={gctx} thekey={key} key={key.id} />
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
                    return <div key={klavierKey.id} className="inline-block" style={{
                        width: hakken_width,
                        height: 130,
                    }} ></div>
                }
                return <KlavierKeyEl gctx={gctx} thekey={klavierKey} key={klavierKey.id} />
            })}
        </div>
    </div>
}







