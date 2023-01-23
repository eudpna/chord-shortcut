
import Head from 'next/head'
import React, { useEffect } from 'react'
import { GameEl } from '../components/game/GameEl'
import { chordToName, guitarChords, guitarChordsData, ukuleleChords, ukuleleChordsData } from '../game/lib/chords'
import guitar from '@tombatossals/chords-db/lib/guitar.json'
import ukulele from '@tombatossals/chords-db/lib/ukulele.json'
import { A } from '../components/A'
import { solfaArr } from '../game/lib/sound/solfa'



function list(instrumentChords: typeof guitarChords | typeof ukuleleChords) {
    return solfaArr.map(key => {
        const chords =  instrumentChords.getChordsByKey(key)
        return <div>
            <div className='text-lg font-bold mt-6'>
                {key.replace('sharp', '#')}
            </div>
            <div className='text-sm'>
                {chords.map(c => {
                    return <span key={chordToName(c)}>
                        {chordToName(c)}　
                    </span>
                })}
            </div>
        </div>
    })
}


const Index: React.FC<{}> = () => {
   
    return <>
        <Head>            
            <title>利用可能なコードの一覧 | こーどめも</title>
            {/* <meta name="viewport" content=""></meta> */}
        </Head>
        <div lang="ja" className="w-full h-full">
            <div className='p-3 max-w-3xl mx-auto pb-20'>
                <div style={{
                    marginLeft: -5,
                    paddingTop: 8,
                }}>
                    <A inSite href="/">戻る</A>
                </div>
                <div className='text-xl pt-6 mb-3' style={{
                    marginLeft: -5,

                }}>
                    利用可能なコード記号の一覧
                </div>
                <div className='text-sm' style={{
                    marginLeft: -3,
                }}>
                    この一覧にないコードは画像が表示されません。
                </div>


            <div>
                    <div className='text-2xl font-bold' style={{
                        marginLeft: -5,
                        marginBottom: -10,
                        marginTop: 50,
                    }}>
                        ギター
                    </div>
                <div>
                        {list(guitarChords)}
                </div>
                
            </div>
            <div className='text-2xl font-bold' style={{
                marginLeft: -5,
                marginBottom: -10,
                marginTop: 90,
            }}>
                ウクレレ
            </div>
            <div>
                    {list(ukuleleChords)}
            </div>
            </div>
        </div>
    </>
}

export default Index




