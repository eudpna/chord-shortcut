import TextareaAutosize from "react-textarea-autosize"
import { Gctx } from "../../../game/Gctx"

export const Setting: React.FC<{
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
            設定
        </div>
        <div className="pl-2">
        <div>
            MIDI入力：
            <select value={gctx.selectedMidiInput ? gctx.selectedMidiInput.id : ''} className="rounded border-gray-400 px-2 bg-white" style={{
                border: 'solid 1px rgb(156,163,175)'
            }} name="" id="" onChange={(e) => {
                gctx.selectedMidiInput = gctx.getMidiInputById(e.target.value)
                // if (e.target.value === '') {
                //     gctx.selectedMidiInput = gctx
                // } else {
                    
                // }
                
                gctx.rerenderUI()
            }}>
                    <option value="">なし</option>
                {gctx.midiInputs.map(midiInput => {
                    return <option key={midiInput.id} value={midiInput.id}>{midiInput.name}</option>
                })}
            </select>
        </div>
        </div>
    </div>
}