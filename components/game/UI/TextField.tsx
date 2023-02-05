import TextareaAutosize from "react-textarea-autosize"
import { Gctx } from "../../../game/Gctx"

export const TextField: React.FC<{
    gctx: Gctx
}> = (props) => {
    const gctx = props.gctx

    return <div>
        <TextareaAutosize
            value={gctx.text}
            placeholder="コード名を空白区切りで入力（例: Em G7 C IIm）"
            className="prevent-shot p-1 resize-none w-full border border-gray-400 rounded"
            style={{
                lineHeight: 1.5,
            }}
            minRows={2}
            onChange={(e) => {
                gctx.setText(e.target.value)
            }}></TextareaAutosize>
    </div>
}