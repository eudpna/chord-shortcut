import TextareaAutosize from "react-textarea-autosize"
import { Gctx } from "../../../game/Gctx"

export const LoadChordMemoEl: React.FC<{
    gctx: Gctx
}> = (props) => {
    const gctx = props.gctx

    return <div className="text-sm p-2 rounded pb-4" style={{
        backgroundColor: '#eee'
    }}>
        <div className="font-bold pb-2" style={{
            color: '#444',
            fontSize: '1rem'
        }}>
            ChordMemoの譜面をロード
        </div>
        <div className="pl-2">
            {/* URL :  */}
            <div
                className="mb-2 mt-2"
            >
                <input type="text" className="p-1 resize-none w-full border bg-white border-gray-400 rounded"
                    value={gctx.chordMemoURL}
                    placeholder="https://chordmemo.nyaw.netのURL"
                    onChange={(e) => {
                        gctx.chordMemoURL = e.target.value
                        gctx.rerenderUI()
                    }} style={{
                        width: '100%'
                    }} />
            </div>
        </div>

        <div className="inline-block">
            <button className="ml-2 p-1 bg-white px-3 resize-none border border-gray-400 rounded" onClick={() => {
                gctx.loadChordMemo()
            }}>
                ロード
            </button>
        </div>

        <div className="inline-block">
            {gctx.undoText !== null ? 
            <div className="ml-2.5 mt-1 text-sm">
                ロードしました。
                    <button className="text-xs ml-0 p-0.5 bg-white px-3 resize-none border border-gray-400 rounded" 
                    onClick={() => {
                        gctx.undo()
                    }}
                    >
                    Undo
                </button>
                </div> : null}
        </div> 
    </div>
}