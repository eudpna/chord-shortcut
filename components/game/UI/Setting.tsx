import TextareaAutosize from "react-textarea-autosize"
import { WebMidi } from "webmidi"
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
                <select value={typeof gctx.midiInput === 'string' ? gctx.midiInput : gctx.midiInput.id} className="rounded border-gray-400 px-2 bg-white" style={{
                    border: 'solid 1px rgb(156,163,175)'
                }} name="" id="" onChange={(e) => {
                    if (e.target.value === 'off' || e.target.value === 'all') {
                        gctx.midiInput = e.target.value
                    } else {
                        gctx.midiInput = WebMidi.getInputById(e.target.value)
                    }
                    gctx.rerenderUI()
                }}>
                    <option value="off">なし</option>
                    <option value="all">全て</option>
                    {WebMidi.inputs.map(midiInput => {
                        return <option key={midiInput.id} value={midiInput.id}>{midiInput.name}</option>
                    })}
                </select>
            </div>

            <div className="mt-1">
                MIDI出力：
                <select value={typeof gctx.midiOutput === 'string' ? gctx.midiOutput : gctx.midiOutput.id} className="rounded border-gray-400 px-2 bg-white" style={{
                    border: 'solid 1px rgb(156,163,175)'
                }} name="" id="" onChange={(e) => {
                    if (e.target.value === 'off') {
                        gctx.midiOutput = e.target.value
                    } else {
                        gctx.midiOutput = WebMidi.getOutputById(e.target.value)
                    }
                    gctx.rerenderUI()
                }}>
                    <option value="off">なし</option>
                    {/* <option value="all">全て</option> */}
                    {WebMidi.outputs.map(midi => {
                        return <option key={midi.id} value={midi.id}>{midi.name}&nbsp;</option>
                    })}
                </select>
            </div>

            <div className="mb-2">
                {gctx.isMidiLoop() ? <div className="text-xs" style={{
                    color: '#8c1c1c'
                }}>
                    エラー: MIDI入力機器とMIDI出力機器が重複しています。
                </div> : null
                }
            </div>



            <div className="mt-2">
                {['master', 'chord', 'melody'].map((kind, i) => {
                    return <div key={kind} className="mt-0.5">
                        音量({['マスター', 'コード', 'メロディ'][i]}): &nbsp;
                        <select value={gctx.audioVolume[kind]} className="rounded border-gray-400 px-2 bg-white " style={{
                            border: 'solid 1px rgb(156,163,175)'
                        }} name="" id="" onChange={(e) => {
                            gctx.audioVolume[kind] = Number(e.target.value)
                            gctx.rerenderUI()
                        }}>
                            {Array.from(Array(conf.maxAudioVolume+1).keys()).map(n => {

                                return <option key={n} value={n}>{n}&nbsp;</option>
                            })}
                        </select>
                    </div>
                })}
            </div>

          

        </div>
    </div>
}