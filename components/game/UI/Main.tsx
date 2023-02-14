import Head from "next/head"
import React from "react"
import { conf } from "../../../game/conf"
import { Gctx } from "../../../game/Gctx"
import { Pitch } from "../../../game/lib/music/Pitch"
import { Scale } from "../../../game/lib/music/Scale"
import { A } from "../../A"
import { ChordBtnsEl } from "./ChordBtnsEl"
import { KeySetting } from "./KeySetting"
import { hakken_width, KlavierEl } from "./KlavierEl"
// import { indicator_width } from "./KlavierKeyEl"
import { Setting } from "./Setting"
import { TextField } from "./TextField"
import { TitleSetting } from "./TitleSetting"



export const Main: React.FC<{
    gctx: Gctx
}> = (props) => {
    const gctx = props.gctx
    const title = gctx.title.trim()

    return <div className="px-2 max-w-3xl mx-auto noselect">

        {title ?
            <Head>
                <title>{title} | ChordShortcut</title>
            </Head> : null}

        {gctx.loadedPercentage !== 100 ? 
            <div className="right-0 top-0 fixed p-1 px-2">音声をロード中 {gctx.loadedPercentage}%</div>
        : null}
        
        
        {/* title */}
        <div className="mb-6">

            <A href="/" className="text-xl font-bold
             text-gray-700 inline-block">
                ChordShortcut
            </A>

            <div className="mt-12">
                <KeySetting gctx={gctx} />
            </div>

            <div className="mt-4">
                <TextField gctx={gctx} />
            </div>

            <div className="mt-8 noselect">
                <ChordBtnsEl gctx={gctx} />
            </div>

            <div className="mt-4 mb-24 noselect">
                <KlavierEl gctx={gctx} />
            </div>

            <div className="mt-4 noselect text-sm text-right">
                <input type="checkbox" name="topiano"
                    id="topiano"
                    className="cursor-pointer"
                checked={gctx.keyboardToPiano}
                onChange={(e) => {
                    gctx.keyboardToPiano = !gctx.keyboardToPiano
                    gctx.rerenderUI()
                }}
                />
                <label
                    className="cursor-pointer"
                 htmlFor="topiano">キーボードの下段をピアノに</label>
            </div>

            <div className="mt-4">
                <Setting gctx={gctx} />
            </div>

            <div className="mt-6">
                <TitleSetting gctx={gctx} />
            </div>

            

            <div className="mt-6 text-xs">
                <A href={gctx.getRomanNumericURL()}>
                    ディグリーネームに変換(key={gctx.key})
                </A>
            </div>

            <div className=" text-xs">
                <A href={
                    location.href.replace(location.search, '') +
                    `?title=${encodeURIComponent('ダイアトニック・コード')}` +
                    `&text=${encodeURIComponent(
                        Scale.diatonic.join(' ') + '\n' +
                        Scale.diatonic4.join(' ')
                    )}` +
                    `&key=${encodeURIComponent('C')}`
                }>
                    ダイアトニックのテンプレート
                </A>
            </div>

            <div className="mt-6 text-xs">
                <A href="/list">利用可能なコード名の一覧</A>
            </div>

            <div className="mt-1 text-xs pb-12">
                <A href="https://github.com/eudpna/chordshortcut">GitHub</A>
            </div>
          

            {/* <div className="mt-6 pb-4">
                <div className="text-xs text-right" style={{
                }}>
                    <A href={gctx.getChordMemoURL()}>
                        こーどめもで開く
                    </A>
                </div>
            </div> */}

        </div>
    </div>
}