export type Direction2 = 'left' | 'right'
export type Direction4 = 'left' | 'right' | 'top' | 'bottom'


export function isInRect(p: Vec2, r: Rect) {
    return r.x < p.x && p.x < r.x + r.w &&
        r.y < p.y && p.y < r.y + r.h
}


export type Vec2 = {
    x: number,
    y: number
}

export type Rect = {
    x: number
    y: number
    w: number
    h: number
}

export type Bodi = Rect & {
    v: Vec2
    minSpeed?: Vec2
    maxSpeed?: Vec2
    drag?: number
    isGround?: boolean
    isOnSlope?: boolean
    isJump?: boolean
    noCollide?: boolean
}

export const addVec2 = (v1: Vec2, v2: Vec2) => {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y
    }
}

export const restrict = (n: number, min: number, max: number) => {
    if (n > max) return max
    if (n < min) return min
    return n
}

export const distance = (v1: Vec2, v2: Vec2) => {
    return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2))
}


export function restrictVec2(v: Vec2, minSpeed?: number, maxSpeed?: number): Vec2 {
    const d = Math.sqrt(((v.x) * (v.x) + (v.y * v.y)))
    if (minSpeed !== undefined && d < minSpeed) {
        return {
            x: v.x / d * minSpeed,
            y: v.y / d * minSpeed
        }
    }
    if (maxSpeed !== undefined && d > maxSpeed) {
        return {
            x: v.x / d * maxSpeed,
            y: v.y / d * maxSpeed
        }
    }
    return {
        x: v.x,
        y: v.y
    }
}

export function angleToVec(a: number) {
    return {
        x: Math.cos(a),
        y: Math.sin(a)
    }
}


export function isHittingRects(r1: Rect, r2: Rect): boolean {
    return Math.max(r1.x, r2.x) <= Math.min(r1.x + r1.w, r2.x + r2.w) &&
        Math.max(r1.y, r2.y) <= Math.min(r1.y + r1.h, r2.y + r2.h)
}

export function centerOfRect(r: Rect): Vec2 {
    return {
        x: r.x + (r.w / 2),
        y: r.y + (r.h / 2),
    }
}

export function denormalize(a: number, min: number, max: number) {
    return (a * (max - min)) + min
}