import Head from "next/head"
import React, { useEffect, useState } from "react"
import { Gctx } from "../../../game/Gctx"
import { ChordBtns } from "../../../game/lib/ChordBtns"
import useMIDI from "../../../game/lib/useMIDI"
import { sampleScores } from "../../../game/sample"
import { diatonic, diatonic4 } from "../../../lib/lib1"
import { A } from "../../A"
import { CopyIcon } from "../../icons/CopyIcon"
import { ChordBtnsEl } from "./ChordBtnsEl"
import { KeySetting } from "./KeySetting"
import { KlavierEl } from "./KlavierEl"
import { LoadChordMemoEl } from "./LoadChordMemoEl"
import { Midi2ChordTextField } from "./Midi2ChordTextField"
import { Setting } from "./Setting"
import { TextField } from "./TextField"
import { TitleSetting } from "./TitleSetting"




export const Main: React.FC<{
    gctx: Gctx
}> = (props) => {
    const gctx = props.gctx
    const title = gctx.title.trim()



    // useMIDI((note, _) => {
    //     gctx.playNote(note)
    // }, (note) => {
    //     gctx.stopNote(note)
    // })

    return <div className="pt-4 px-2 pb-3 max-w-3xl mx-auto" style={{
        
    }}>

        {title ?
            <Head>
                <title>{title} | ChordShortcut</title>
            </Head> : null}



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
            <div className="mt-4">
                <TextField gctx={gctx} />
            </div>

            <div className="mt-12">
                <ChordBtnsEl gctx={gctx} />
            </div>

            <div className="mt-4 mb-24">
                <KlavierEl gctx={gctx} />
            </div>

            <div className="mt-4">
                <Setting gctx={gctx} />
            </div>

            <div className="mt-4">
                <TitleSetting gctx={gctx} />
            </div>

            <div className="text-sm mt-4">
                <div>プリセット:</div>
                <ul className="text-sm ml-2 list-none">
                    <li>
                        <A href={
                            location.href.replace(location.search, '') +
                            `?title=${encodeURIComponent('ダイアトニック・コード')}` +
                            `&text=${encodeURIComponent(
                                diatonic.join(' ') + '\n' +
                                diatonic4.join(' ')
                            )}` +
                            `&key=${encodeURIComponent('C')}`
                        }>
                            ダイアトニック・コード
                        </A>
                    </li>
                </ul>
                
            </div>

            <div className="text-xs mt-12">
                <div className="mb-4">
                    <A href="/list">利用可能なコード記号の一覧</A>
                </div>
                <div className="">
                    不具合報告や要望などは <A href="https://twitter.com/teiwv">@teiwv</A> まで。<br />最終更新: 2023/02/03
                </div>
            </div>


            
            {/* <div className="mt-4">
                <Midi2ChordTextField gctx={gctx} />
            </div> */}

            {/* <div className="mt-6">
                <LoadChordMemoEl gctx={gctx} />
            </div> */}
        </div>
    </div>
}