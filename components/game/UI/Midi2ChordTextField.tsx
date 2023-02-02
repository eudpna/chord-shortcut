import TextareaAutosize from "react-textarea-autosize"
import { Gctx } from "../../../game/Gctx"

import {v4 as uudiv4} from 'uuid'

export const Midi2ChordTextField: React.FC<{
    gctx: Gctx
}> = (props) => {
    const gctx = props.gctx

    return <div className="rounded border-gray-400 px-2 pt-2" style={{
        backgroundColor: '#eee',
    }}>
        <div className="font-bold text-sm pb-2" style={{
            color: '#444',
            // fontSize: '0.0rem'
        }}>
            MIDI鍵盤をコードに割り当てる
        </div>

        <div className=" p-2 pt-1">
            <div className="flex">
                <div>
                    <TextareaAutosize
                        id="midi2chord-input"
                        value={gctx.midi2chordText}
                        // spellcheck="false"
                        placeholder=""
                        className="midi2chord-input
                        prevent-shot p-1 bg-white resize-none  border border-gray-400 rounded"
                        style={{
                            width: 200,
                            lineHeight: 1.5,
                            // fontSize: '16px'
                        }} minRows={2} onChange={(e) => {
                            gctx.setMidi2ChordText(e.target.value)
                        }}></TextareaAutosize>
                </div>
                <div>
                    <div className="inline-block  p-1">
                        {gctx.midi2chord.map((m,i) => {                                             return <div key={m===null?i:m.noteNumbers+m.chordName} className="" style={{
                                lineHeight: 1.5,
                                color: '#26e045'
                            }}>
                                <span className="text-sm">
                                {m === null ? '　' : '有効'}
                                </span>
                            </div>
                        })}
                    </div>
                </div>

            </div>
           
           <div className="text-sm">
            オクターヴ
                &nbsp;
                <select value={gctx.midi2chordOctave} className="rounded border-gray-400 px-2 bg-white " style={{
                    border: 'solid 1px rgb(156,163,175)'
                }} name="" id="" onChange={(e) => {
                    gctx.midi2chordOctave = Number(e.target.value)
                    gctx.rerenderUI()
                }}>
                    {Array.from(Array(9).keys()).map(n => {
                        return <option key={n} value={n}>{n}&nbsp;</option>
                    })}
                </select>
                &nbsp;
                に
                &nbsp;

                <button className="rounded-full px-3 p-0.5 bg-white text-xs" style={{
                    border: 'solid 1px #555',
                    color: '#555',
                }} onClick={() => {
                    gctx.setMidi2ChordDiatonic()
                    }}>
                        ダイアトニックコードを自動割り当て
                </button>
                
           </div>
             
        </div>
    </div>
    
}