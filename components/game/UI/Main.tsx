import Head from "next/head"
import React, { useEffect, useState } from "react"
import { Gctx } from "../../../game/Gctx"
import { ChordBtns } from "../../../game/lib/ChordBtns"
import useMIDI from "../../../game/lib/useMIDI"
import { sampleScores } from "../../../game/sample"
import { A } from "../../A"
import { CopyIcon } from "../../icons/CopyIcon"
import { ChordBtnsEl } from "./ChordBtnsEl"
import { KeySetting } from "./KeySetting"
import { KlavierEl } from "./KlavierEl"
import { LoadChordMemoEl } from "./LoadChordMemoEl"
import { Setting } from "./Setting"




export const Main: React.FC<{
    gctx: Gctx
}> = (props) => {
    const gctx = props.gctx

    // useMIDI((note, _) => {
    //     gctx.playNote(note)
    // }, (note) => {
    //     gctx.stopNote(note)
    // })

    return <div className="pt-4 px-2 pb-3 max-w-3xl mx-auto" style={{
        
    }}>

        {gctx.showLoadingProgress ? 
            <div className="right-0 top-0 absolute p-1 px-2">音声をロード中 {gctx.loadedPercentage}%</div>
        : null}
        
        
        {/* title */}
        <div className="mb-6">
            <A href="/" className="text-xl font-bold text-gray-700 inline-block">
                ChordShortcut
            </A>
            {/* <div className="text-sm inline-block pl-2" style={{
            }}>
                
            </div> */}
            <div className="mt-4">
                <KeySetting gctx={gctx} />
            </div>
            <div className="mt-20">
                <ChordBtnsEl gctx={gctx} />
            </div>
            <div className="mt-4">
                <KlavierEl gctx={gctx} />
            </div>
            <div className="mt-28">
                <Setting gctx={gctx} />
            </div>
            <div className="mt-6">
                <LoadChordMemoEl gctx={gctx} />
            </div>
        </div>
    </div>
}