import { roman_numeric } from "../../util/str";
import { Solfa, SolfaName } from "./Solfa";

export class Scale {

    static degreeToSolfaName(tonic: SolfaName, degree: number) {
        const tonicSolfaNumber = Solfa.nameToNumber(tonic)
        const solfaNumber = (tonicSolfaNumber + Scale.majorkey_interval[degree]) % 12
        return Solfa.numberToName(solfaNumber)
    }

    static romanNumericToChordName(chordName: string, tonic: SolfaName) {
        let result = chordName;
        [6, 5, 3, 4, 2, 1, 0].map(i => {
            result = result.replace(roman_numeric[i], Scale.degreeToSolfaName(tonic, i))
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

}