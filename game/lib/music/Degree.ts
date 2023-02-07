export type Degree = {
    name: string
    number: number
}

export function romanNumberToDegree(r: string) {
    return romanNumberList.indexOf(r)
}

export const romanNumberList = [
    'I',
    'IIb',
    'II',
    'IIIb',
    'III',
    'IV',
    'Vb',
    'V',
    'VIb',
    'VI',
    'VIIb',
    'VII',
]

const degreeList: Degree[] = [
    {
        name: 'r',
        number: 0,
    },
    {
        name: '9',
        number: 2,
    },
    {
        name: '2',
        number: 2,
    },
    {
        name: 'm3',
        number: 3
    },
    {
        name: '3',
        number: 4
    },
    {
        name: '4',
        number: 5
    },
    {
        name: '11',
        number: 5
    },
    {
        name: 'b5',
        number: 6
    },
    {
        name: '5',
        number: 7
    },
    {
        name: 'm7',
        number: 9
    },
    {
        name: '6',
        number: 9
    },
    {
        name: '13',
        number: 9
    },
    {
        name: '7',
        number: 10
    },
    {
        name: 'M7',
        number: 11
    },
]

export function getDegreeFromNumber(n: number) {
    const tmp = degreeList.filter(d => d.number === n)
    if (!tmp.length) return null
    return tmp[0]
}