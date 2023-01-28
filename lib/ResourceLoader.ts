import { Howl } from "howler";

export type LoadedResourceImage = {
    src: string
    type: 'image'
    resource: HTMLImageElement
}

export type LoadedResourceAudio = {
    src: string
    type: 'audio'
    resource: Howl
}

export type LoadedResource = LoadedResourceImage | LoadedResourceAudio

export class ResourceLoader {
    loadedResources: LoadedResource[] = []

    fileNumToLoad: number = 0

    fileNumLoaded = () => {
        return this.loadedResources.length
    }


    // setOnStateChange(onStateChange: (resource: LoadedResource, precent: number) => any) {
    //     this.onStateChange = onStateChange
    // }

    load(src: string, type: 'image' | 'audio', onLoad: (resource: LoadedResource, percent: number) => void = (_: any) => {}) {

        this.fileNumToLoad ++
        // this.onStateChange()

        if (type === 'image') {
            this.loadImage(src)
            .then((resource) => {
                onLoad(resource, Math.floor((this.fileNumLoaded() / this.fileNumToLoad) * 100))
                // this.onStateChange()
            })
        } else
        if (type === 'audio') {
            this.loadAudio(src)
                .then((resource) => {
                    onLoad(resource, Math.floor((this.fileNumLoaded() / this.fileNumToLoad) * 100))
                    // this.onStateChange()
                })
        }
    }

    loadImage(src: string): Promise<LoadedResourceImage> {
        return new Promise((resolve, reject) => {

            const image = new Image() // Using optional size for image

            image.src = src
            image.addEventListener('load', e => {
                const resource: LoadedResourceImage = {
                    src: src,
                    type: 'image',
                    resource: image,
                }
                this.loadedResources.push(resource)
                resolve(resource)
            });
        })
    }

    loadAudio(src: string): Promise<LoadedResourceAudio> {
        return new Promise((resolve, reject) => {

            const howl = new Howl({
                src: [src]
            });

            howl.on("load", () => {
                const resource: LoadedResourceAudio = {
                    src: src,
                    type: 'audio',
                    resource: howl,
                }
                this.loadedResources.push(resource)
                resolve(resource)
            })
        })
    }

}