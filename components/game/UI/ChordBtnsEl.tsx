import { useEffect } from "react"
import { Gctx } from "../../../game/Gctx"
import { setTouchEventListeners } from "../../../game/input/touch"
import { ChordBtnEl } from "./ChordBtnEl"


export const ChordBtnsEl: React.FC<{
    gctx: Gctx
}> = (props) => {
    const gctx = props.gctx

    const bs = gctx.chordBtns.btns

    const btns = [
        bs.slice(0, 10),
        bs.slice(10, 20),
        bs.slice(20, 30),
        bs.slice(30, 40),
    ]

   

    return <div className="p-0 noselect" style={{
        whiteSpace: 'nowrap',
    }}>
        {btns.map((line, i) => <div key={i} style={{
            height: 70
        }}>
                {line.map((chordBtn, j) => {
                    return <div key={chordBtn.id} className="inline-block">
                        <ChordBtnEl
                            gctx={gctx}
                            chordBtn={chordBtn}
                            index={i*10+j}
                        />
                    </div>
                })}
            </div>
        )}
    </div>
}






