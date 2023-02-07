import { Rect, Vec2 } from "./math"


export function getElementRect(element: Element) {
    const rect = element.getBoundingClientRect()
    return {
        x: rect.x,
        y: rect.y,
        w: rect.width,
        h: rect.height,
    }
}

