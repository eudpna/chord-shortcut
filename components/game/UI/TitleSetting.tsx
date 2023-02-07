import TextareaAutosize from "react-textarea-autosize"
import { WebMidi } from "webmidi"
import { conf } from "../../../game/conf"
import { Gctx } from "../../../game/Gctx"

export const TitleSetting: React.FC<{
    gctx: Gctx
}> = (props) => {
    const gctx = props.gctx

    return <div className="p-2 rounded pb-4" style={{
        backgroundColor: '#eee'
    }}>
        <div className="font-bold text-xs pb-1 pl-1" style={{
            color: '#444',
        }}>
            プロジェクトタイトル
        </div>
        <div className="px-2">
            <div>
                <input type="text" className="prevent-shot p-1 resize-none w-full border border-gray-400 rounded bg-white"
                    value={gctx.title}
                    placeholder="タイトル"
                    onChange={(e) => {
                        gctx.title = e.target.value
                        gctx.rerenderUI()
                    }} style={{
                        width: '100%'
                    }} />
            </div>
        </div>
    </div>
}