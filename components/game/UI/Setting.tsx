import { WebMidi } from "webmidi"
import { conf } from "../../../game/conf"
import { Gctx, SoundType } from "../../../game/Gctx"

export const Setting: React.FC<{
    gctx: Gctx
}> = (props) => {
    const gctx = props.gctx

    return <div className="rounded  p-2 pl-3 text-sm py-5" style={{
        backgroundColor: '#eee'
    }}>

        <div className="pl-1">


          

            {/* コード設定 */}
            <div className="">
                <div className="font-bold text-xs pt-1 pb-1" style={{
                    color: '#444',
                    marginLeft: -5
                    // fontSize: '1rem'
                }}>
                    コード
                </div>

                <div className="ml-2">
                    <div className="">
                        音色：
                        <select value={gctx.soundTypes.chord} className="rounded border-gray-400 px-2 bg-white" style={{
                            border: 'solid 1px rgb(156,163,175)'
                        }}
                            onChange={(e) => {
                                gctx.soundTypes.chord = e.target.value as SoundType
                                gctx.rerenderUI()
                            }}>                                       <option value="piano">グランドピアノ</option>
                            <option value="epiano">エレクトリックピアノ</option>
                        </select>
                    </div>

                    <div className="mt-2">
                        音量：<input
                            className="cursor-pointer"
                            type="range" min={0} max={conf.maxAudioVolume}
                            value={gctx.audioVolume.chord}
                            onChange={(e) => {
                                gctx.audioVolume.chord = Number(e.target.value)
                                gctx.rerenderUI()
                            }}
                        />
                    </div>
                </div>
            </div>


            {/* メロディ */}
            <div className=" mt-6">
                <div className="font-bold text-xs pt-1 pb-1" style={{
                    color: '#444',
                    marginLeft: -5
                }}>
                    メロディ
                </div>

                <div className="ml-2">
                    <div className="mt-1">
                        音色：
                        <select value={gctx.soundTypes.melody} className="rounded border-gray-400 px-2 bg-white" style={{
                            border: 'solid 1px rgb(156,163,175)'
                        }}
                            onChange={(e) => {
                                gctx.soundTypes.melody = e.target.value as SoundType
                                gctx.rerenderUI()
                            }}>                                       <option value="piano">グランドピアノ</option>
                            <option value="epiano">エレクトリックピアノ</option>
                        </select>
                    </div>

                    <div className="mt-2">
                        音量：<input
                            className="cursor-pointer"
                            type="range" min={0} max={conf.maxAudioVolume}
                            value={gctx.audioVolume.melody}
                            onChange={(e) => {
                                gctx.audioVolume.melody = Number(e.target.value)
                                gctx.rerenderUI()
                            }}
                        />
                    </div>
                </div>
            </div>




            <div className="mt-6">


                <div className="font-bold text-xs pt-1 pb-1" style={{
                    color: '#444',
                    marginLeft: -5
                }}>
                    MIDI
                </div>

                <div>
                    入力：
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
                    出力：
                    <select value={typeof gctx.midiOutput === 'string' ? gctx.midiOutput : gctx.midiOutput.id} className="rounded border-gray-400 px-2 bg-white" style={{
                        border: 'solid 1px rgb(156,163,175)'
                    }}
                        onChange={(e) => {
                            if (e.target.value === 'off') {
                                gctx.midiOutput = e.target.value
                            } else {
                                gctx.midiOutput = WebMidi.getOutputById(e.target.value)
                            }
                            gctx.rerenderUI()
                        }}>
                        <option value="off">なし</option>
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
            </div>
        </div>
    </div>
}