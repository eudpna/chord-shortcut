import { Gctx } from "../../../game/Gctx"
import { Solfa, SolfaName } from "../../../game/lib/music/Solfa"


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
                gctx.setKey(e.target.value as SolfaName)
            }}>
                {Solfa.list.map((solfaName, i) => {
                    return <option className="" key={solfaName} value={solfaName}>{`${solfaName}　`}</option>
                })}
            </select>
        </div>
    </div>
}