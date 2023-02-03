import TextareaAutosize from "react-textarea-autosize"
import { Gctx } from "../../../game/Gctx"
import { Solfa, solfaArr, solfaFlatArr, SolfaToFlat } from "../../../game/lib/sound/solfa"
import { solfaNameToSolfaNumber } from "../../../lib/music/Solfa"

const solfaSharp = solfaArr.filter(solfa => {
    return solfa.slice(-1) !== 'b'
}) as Solfa[]

export const KeySetting: React.FC<{
    gctx: Gctx
}> = (props) => {
    const gctx = props.gctx

    return <div className="text-sm p-0">
        <div>
            key&nbsp;=&nbsp; 
            <select value={gctx.key} className=" rounded border-gray-400 pl-2 pr-1" style={{
                border: 'solid 1px rgb(156,163,175)'
            }} name="" id="" onChange={(e) => {
                gctx.setKey(e.target.value as Solfa)
            }}>
                {solfaFlatArr.map((solfa, i) => {
                    const minor = solfaFlatArr[(i+9)%12]
                    return <option className="pr-1" key={solfa} value={SolfaToFlat(solfa)}>{`${solfa}`}</option>
                })}
                {/* {solfaSharp.map(solfa => {
                    return <option key={solfa} value={SolfaToFlat(solfa)}>{solfa.slice(-1)==='#'?`${solfa} (${SolfaToFlat(solfa)})`:solfa}</option>
                })} */}
            </select>
        </div>
    </div>
}