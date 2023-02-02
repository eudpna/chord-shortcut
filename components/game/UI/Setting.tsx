import TextareaAutosize from "react-textarea-autosize"
import { conf } from "../../../game/conf"
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
                <select value={typeof gctx.selectedMidiInput === 'string' ? gctx.selectedMidiInput : gctx.selectedMidiInput.id} className="rounded border-gray-400 px-2 bg-white" style={{
                    border: 'solid 1px rgb(156,163,175)'
                }} name="" id="" onChange={(e) => {
                    gctx.selectedMidiInput = gctx.getMidiInputById(e.target.value)
                    // if (e.target.value === '') {
                    //     gctx.selectedMidiInput = gctx
                    // } else {

                    // }

                    gctx.rerenderUI()
                }}>
                    <option value="off">なし</option>
                    <option value="all">全て</option>
                    {gctx.midiInputs.map(midiInput => {
                        return <option key={midiInput.id} value={midiInput.id}>{midiInput.name}</option>
                    })}
                </select>
            </div>



            <div className="mt-2">
                {['master', 'chord', 'melody'].map((kind, i) => {
                    return <div key={kind} className="mt-0.5">
                        音量({['マスター', 'コード', 'メロディ'][i]}): &nbsp;
                        <select value={gctx.audioVolume[kind]} className="rounded border-gray-400 px-2 bg-white pr-2.5" style={{
                            border: 'solid 1px rgb(156,163,175)'
                        }} name="" id="" onChange={(e) => {
                            gctx.audioVolume[kind] = Number(e.target.value)
                            gctx.rerenderUI()
                        }}>
                            {Array.from(Array(conf.maxAudioVolume+1).keys()).map(n => {

                                return <option key={n} value={n}>{n}</option>
                            })}
                        </select>
                    </div>
                })}
            </div>

          

        </div>
    </div>
}