import TextareaAutosize from "react-textarea-autosize"
import { Gctx } from "../../../game/Gctx"
import { Solfa, solfaArr, SolfaToFlat } from "../../../game/lib/sound/solfa"

const solfaSharp = solfaArr.filter(solfa => {
    return solfa.slice(-1) !== 'b'
}) as Solfa[]

export const Setting: React.FC<{
    gctx: Gctx
}> = (props) => {
    const gctx = props.gctx

    return <div className="text-sm p-0 pt-6">
        <div>
            key&nbsp;=&nbsp; 
            <select value={gctx.key} className=" rounded border-gray-400 px-2" style={{
                border: 'solid 1px rgb(156,163,175)'
            }} name="" id="" onChange={(e) => {
                gctx.setKey(e.target.value as Solfa)
            }}>
                {solfaSharp.map(solfa => {
                    return <option key={solfa} value={SolfaToFlat(solfa)}>{solfa.slice(-1)==='#'?`${solfa} (${SolfaToFlat(solfa)})`:solfa}</option>
                })}
            </select>
        </div>
    </div>
}