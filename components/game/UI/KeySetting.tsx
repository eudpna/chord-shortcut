import { Gctx } from "../../../game/Gctx"
import { Solfa, solfaArr, solfaFlatArr, SolfaToFlat } from "../../../game/lib/sound/solfa"


export const KeySetting: React.FC<{
    gctx: Gctx
}> = (props) => {
    const gctx = props.gctx

    return <div className="text-sm p-0">
        <div>
            key&nbsp;=&nbsp; 
            <select value={gctx.key} className=" rounded border-gray-400 pl-2" style={{
                border: 'solid 1px rgb(156,163,175)'
            }} name="" id="" onChange={(e) => {
                gctx.setKey(e.target.value as Solfa)
            }}>
                {solfaFlatArr.map((solfa, i) => {
                    // const minor = solfaFlatArr[(i+9)%12]
                    return <option className="" key={solfa} value={SolfaToFlat(solfa)}>{`${solfa}　`}</option>
                })}
            </select>
        </div>
    </div>
}