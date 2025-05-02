const UNICODE_HANGEUL_BEGIN: number = 0xAC00;
const UNICODE_CONSONANT_BEGIN: number = 0x3131 - 1;
const UNICODE_VOWEL_BEGIN: number = 0x314F;

const FIRST_LIST: Array<string> = [ "r", "R", "s", "e", "E", "f", "a", "q",
    "Q", "t", "T", "d", "w", "W", "c", "z", "x", "v", "g" ]
const MIDDLE_LIST: Array<string> = [ "k", "o", "i", "O", "j", "p", "u", "P",
    "h", "hk", "ho", "hl", "y", "n", "nj", "np", "nl", "b", "m",
    "ml", "l" ]
const FINAL_LIST: Array<string> = [ " ", "r", "R", "rt", "s", "sw", "sg", "e",
    "f", "fr", "fa", "fq", "ft", "fx", "fv", "fg", "a",
    "q", "qt", "t", "T", "d", "w", "c", "z", "x", "v", "g" ]
const CONSONANT_LIST: Array<string> = [ " ", "r", "R", "rt", "s", "sw", "sg", "e", "E",
    "f", "fr", "fa", "fq", "ft", "fx", "fv", "fg", "a",
    "q", "Q", "qt", "t", "T", "d", "w", "W", "c", "z", "x", "v", "g" ]

type CharType = 'First' | 'Middle' | 'Final' | 'Separate' | 'Other'

function isConsonantOrVowel(c: string) {
    switch (c) {
    case 'r': // ㄱ
    case 'R': // ㄲ
    case 's': // ㄴ
    case 'e': // ㄷ
    case 'E': // ㄸ
    case 'f': // ㄹ
    case 'a': // ㅁ
    case 'q': // ㅂ
    case 'Q': // ㅃ
    case 't': // ㅅ
    case 'T': // ㅆ
    case 'd': // ㅇ
    case 'w': // ㅈ
    case 'W': // ㅉ
    case 'c': // ㅊ
    case 'z': // ㅋ
    case 'x': // ㅌ
    case 'v': // ㅍ
    case 'g': // ㅎ
        return 1;
    case 'k': // ㅏ
    case 'o': // ㅐ
    case 'i': // ㅑ
    case 'O': // ㅒ
    case 'j': // ㅓ
    case 'p': // ㅔ
    case 'u': // ㅕ
    case 'P': // ㅖ
    case 'h': // ㅗ
    case 'y': // ㅛ
    case 'n': // ㅜ
    case 'b': // ㅠ
    case 'm': // ㅡ
    case 'l': // ㅣ
        return 2;
    default:
        return -1;
    }
}

function combineFinal(a: string, b: string): number {
    const s = a[0] + b[0]
    return FINAL_LIST.findIndex((v) => v === s)
}

function combineMiddle(a: string, b: string): number {
    const s = a[0] + b[0]
    return MIDDLE_LIST.findIndex((v) => v === s)
}

function divide(str: string): CharType[] {
    const result: CharType[] = []

    for (let i = 0; i < str.length; i++) {
        switch(isConsonantOrVowel(str[i])) {
            case 1: {
                if (i < str.length - 1) {
                    if (isConsonantOrVowel(str[i + 1]) == 2) {
                        result.push('First')
                        continue
                    }
                    if (i > 1) {
                        if (result[i - 2] === 'First' && result[i - 1] === 'Middle' && isConsonantOrVowel(str[i + 1]) !== 2) {
                            result.push('Final')
                            continue
                        }
                    }
                    if (i > 2) {
                        if (result[i - 3] === 'First' && result[i - 2] === 'Middle' && result[i - 1] === 'Final'
                            && isConsonantOrVowel(str[i + 1]) !== 2 && combineFinal(str[i - 1], str[i]) !== -1) {
                            result.push('Final')
                            continue
                        }
                        if (result[i - 3] === 'First' && result[i - 2] === 'Middle' && result[i - 1] === 'Middle'
                            && isConsonantOrVowel(str[i + 1]) !== 2) {
                            result.push('Final')
                            continue
                        }
                    }
                    if (i > 3) {
                        if (result[i - 4] === 'First' && result[i - 3] === 'Middle' && result[i - 2] === 'Middle' && result[i - 1] === 'Final'
                            && isConsonantOrVowel(str[i + 1]) !== 2 && combineFinal(str[i - 1], str[i]) !== -1) {
                            result.push('Final')
                            continue
                        }
                    }
                } else {
                    if (i > 1) {
                        if (result[i - 2] === 'First' && result[i - 1] === 'Middle') {
                            result.push('Final')
                            continue
                        }
                    }
                    if (i > 2) {
                        if (result[i - 3] === 'First' && result[i - 2] === 'Middle' && result[i - 1] === 'Final'
                            && combineFinal(str[i - 1], str[i]) !== -1) {
                            result.push('Final')
                            continue
                        }
                        if (result[i - 3] === 'First' && result[i - 2] === 'Middle' && result[i - 1] === 'Middle') {
                            result.push('Final')
                            continue
                        }
                    }
                    if (i > 3) {
                        if (result[i - 4] === 'First' && result[i - 3] === 'Middle' && result[i - 2] === 'Middle' && result[i - 1] === 'Final'
                            && combineFinal(str[i - 1], str[i])!== -1) {
                            result.push('Final')
                            continue
                        }
                    }
                }
    
                result.push('Separate')
                continue
            }
            case 2: {
                if (i !== 0) {
                    switch(result.at(-1)) {
                        case 'First': {
                            result.push('Middle')
                            continue
                        }
                        case 'Middle': {
                            if (combineMiddle(str[i - 1], str[i]) !== -1) {
                                result.push('Middle')
                                continue
                            }
                        }
                    }  
                }

                result.push('Separate')
                continue
            }
            default: {
                const code = str.charCodeAt(i)
                if ((code >= 32 && code <= 64) || (code >= 91 && code <= 96) || (code >= 123 && code <= 126)) {
                    result.push('Other')
                    continue
                }
            }
        }
    }

    return result
}

function combine(str: string, typeList: CharType[]): string {
    let result = ''
    let i = 0;

    while (i < str.length) {
        switch(typeList[i]) {
            case 'Separate': {
                switch (isConsonantOrVowel(str[i])) {
                    case 1: {
                        if (i < str.length - 1) {
                            let combinedFinal = combineFinal(str[i], str[i + 1])
                            if (isConsonantOrVowel(str[i + 1]) === 1 && combinedFinal !== -1) {
                                result += String.fromCodePoint(UNICODE_CONSONANT_BEGIN + combinedFinal)
                                i++
                                continue
                            }
                        }
                        const idx = FINAL_LIST.findIndex((v) => v === str[i])
                        result += String.fromCodePoint(UNICODE_CONSONANT_BEGIN + idx)
                        i++
                        continue
                    }
                    case 2: {
                        const idx = MIDDLE_LIST.findIndex((v) => v === str[i])
                        result += String.fromCodePoint(UNICODE_VOWEL_BEGIN + idx)
                        i++
                        continue
                    }
                }
            }
            case 'Other': {
                result += str[i]
                i++
                continue
            }
        }

        let firstIdx = 0
        if (typeList[i] === 'First') {
            firstIdx = FIRST_LIST.findIndex((v) => v === str[i])
            i++
        }

        let middleIdx = 0
        if (typeList[i] === 'Middle') {
            middleIdx = MIDDLE_LIST.findIndex((v) => v === str[i])
            i++

            if (i < str.length) {
                if (typeList[i] === 'Middle') {
                    let combinedMiddle = combineMiddle(str[i - 1], str[i])

                    if (combinedMiddle !== -1) middleIdx = combinedMiddle

                    i++
                }
            }
        }

        let finalIdx = 0

        if (i < str.length) {
            if (typeList[i] === 'Final') {
                finalIdx = FINAL_LIST.findIndex((v) => v === str[i])
                i++

                if (i < str.length) {
                    if (typeList[i] === 'Final') {
                        let combinedFinal = combineFinal(str[i - 1], str[i])

                        if (combinedFinal !== -1) finalIdx = combinedFinal

                        i++
                    }
                }
            }
        }

        result += String.fromCodePoint(UNICODE_HANGEUL_BEGIN + (firstIdx * 21 * 28) + (middleIdx * 28) + finalIdx)
    }

    return result
}

/**
 * Convert a korean alphabet written in english keyboard layout to hangeul\
 * ex) 'r' -> 'ㄱ'
 * @param str a korean alphabet written in english keyboard layout
 * @returns a hangeul character
 */
export function convertOne(str: string): string {
    switch (isConsonantOrVowel(str)) {
        case 1: {
            const idx = CONSONANT_LIST.findIndex((v) => v === str)
            return String.fromCodePoint(UNICODE_CONSONANT_BEGIN + idx)
        }
        case 2: {
            const idx = MIDDLE_LIST.findIndex((v) => v === str)
            return String.fromCodePoint(UNICODE_VOWEL_BEGIN + idx)
        }
        default: return ''
    }
}

/**
 * Convert korean word(or sentence) written in english keyboard layout to hangeul\
 * ex) 'dkssud' -> '안녕'
 * @param str korean word(or sentence) written in english keyboard layout
 * @returns hangeul word(or sentence)
 */
export function convert(str: string): string {
    const typeList = divide(str)
    return combine(str, typeList)
}