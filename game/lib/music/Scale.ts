import { roman_numeric } from "../../util/str";
import { romanNumberList } from "./Degree";
import { Solfa, SolfaName } from "./Solfa";

export class Scale {

    static degreeToSolfaName(tonic: SolfaName, degree: number) {
        const tonicSolfaNumber = Solfa.nameToNumber(tonic)
        const solfaNumber = (tonicSolfaNumber + Scale.majorkey_interval[degree]) % 12
        return Solfa.numberToName(solfaNumber)
    }

    static romanNumericToChordName(chordName: string, key: Solfa) {
        
        let result = chordName;
        romanNumberList1.map(r => {
            // const romanNumeric = r
            const degree = (romanNumberList.indexOf(r) - key.number + 12)%12
            
            const solfa = new Solfa(degree)
            console.log(r, degree, solfa.name)
            // const solfaNumber = 
            result = result.replace(r, solfa.name)
        })
        
        return result
    }


    static majorkey_interval = [
        0, 2, 4, 5, 7, 9, 11
    ]

    static diatonic = [
        'I', 'IIm', 'IIIm', 'IV', 'V', 'VIm', 'VIIdim'
    ]

    static diatonic4 = [
        'IM7', 'IIm7', 'IIIm7', 'IVM7', 'V7', 'VIm7', 'VIIm7b5'
    ]

    static degreeNums = {
        '1': 0,
        'm3': 3,
        '3': 4,
        '4': 5,
        'dim5': 6,
        '5': 7,
        'aug5': 8,
        '6': 9,
        'm7': 9,
        '7': 10,
        'M7': 11,
    }
}

export const romanNumberList1 = [
    'VIIb',
    'VIb',
    'IIIb',
    'IIb',
    'VII',
    'VI',
    'IV',
    'V',
    'III',
    'II',
    'I',    
]