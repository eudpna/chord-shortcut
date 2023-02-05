import fs from 'fs'
import path from 'path'

const imgDir = path.join(process.cwd(), '../public/audios')

const targetDir = path.join(process.cwd(), '/resource/audioList.json')

let imgfiles: string[] = []

const dirs = fs.readdirSync(imgDir)


dirs.forEach(dir => {
    if (dir.slice(0, 1) === '.') return

    // specific to this project
    // 特定の音色のみロードする
    if (!(dir === 'epiano' || dir === 'piano')) {
        return
    }


    const tmp = fs.readdirSync(path.join(imgDir, dir))
    tmp.map(file => {
        if (file.slice(0, 1) === '.') return
        imgfiles.push(path.join('/audios/', dir, file))
    })
})

fs.writeFileSync(targetDir, JSON.stringify(imgfiles))