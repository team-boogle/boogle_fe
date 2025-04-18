import { convertOne, convert } from "@/utils/hangeul"

type RandomMap = {[key: string]: number}
const RANDOM_CONSONANT: RandomMap = {
    "r": 2, "R": 1, "s": 2, "e": 2, "E": 1, "f": 2, "a": 2, "q": 2,
    "Q": 1, "t": 2, "T": 1, "d": 2, "w": 2, "W": 1, "c": 2, "z": 2, "x": 2, "v": 2, "g": 2
}
const RANDOM_VOWEL: RandomMap = {
    "k": 4, "o": 2, "i": 2, "O": 1, "j": 4, "p": 2, "u": 2, "P": 1,
    "h": 4, "y": 2, "n": 4, "b": 2, "m": 3, "l": 4
}

export interface Position {
    row: number,
    col: number
}

export interface BoardOption {
    baseScore: number,
    lengthFactor: number,
    consonantRatio: number,
    vowelRatio: number
}

export const defaultBoardOption: BoardOption = {
    baseScore: 100,
    lengthFactor: 1.2,
    consonantRatio: 1,
    vowelRatio: 1
}

export class Board {
    private board: Array<Array<string>>
    private size: number
    private score: number = 0

    private option: BoardOption

    /**
     * generate n x n size board
     * @param n size of board
     * @param [option=defaultBoardOption] option of board to generate
     */
    constructor(n: number, option: BoardOption = defaultBoardOption) {
        this.size = n
        this.option = option
        
        // init board
        this.board = Array.from({ length: n }, () => Array(n).fill(''))

        let y = 0, x = 0
        const dx = [1, 0, -1, 0], dy = [0, 1, 0, -1]
        let level = n
        
        while (level > 1) {
            for (let direction = 0; direction < 4; direction++) {
                for (let i = 0; i < level - 1; i++) {
                    this.board[y][x] = this.generateOne(y, x)
                    x += dx[direction]
                    y += dy[direction]
                }
            }
            x++
            y++
            level -= 2
        }
        if (level == 1) this.board[y][x] = this.generateOne(y, x)
    }

    private generateOne(row: number, col: number): string {
        // calcuate weights
        let consonantWeight = 3
        let vowelWeight = 3

        const inRange = (row: number, col: number): boolean => {
            return (0 <= row && row < this.size && 0 <= col && col < this.size)
        }

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const x = col + dx, y = row + dy
                if (!inRange(y, x)) continue 
                const ch = this.board[y][x]
                if (ch !== '') {
                    if (Object.keys(RANDOM_CONSONANT).includes(ch)) {
                        if (ch === ch.toUpperCase()) vowelWeight += 3
                        else {
                            vowelWeight += 2
                            consonantWeight += 1
                        }
                    }
                    else if (Object.keys(RANDOM_VOWEL).includes(ch)) consonantWeight += 3
                }
            }
        }

        // select random character
        if (this.randomSelect({consonant: consonantWeight * this.option.consonantRatio, vowel: vowelWeight * this.option.vowelRatio}) === "consonant") {
            return this.randomSelect(RANDOM_CONSONANT)
        } else {
            return this.randomSelect(RANDOM_VOWEL)
        }
    }

    private randomSelect(map: RandomMap): string {
        let table: string[] = []
        for (const [key, weight] of Object.entries(map)) {
            table.push(...Array(weight).fill(key))   
        }
        
        const randomIdx = Math.floor(Math.random() * table.length)
        return table[randomIdx]
    }

    getSize(): number {
        return this.size
    }

    /**
     * To access a element, use `board[row][col]` form.
     * @returns whole board
     */
    getAll(): Array<Array<string>> {
        return this.board.map((list) => list.map((v) => convertOne(v)))
    }

    /**
     * If the given position is out of range, return `null`
     * @param pos position of the element to get
     * @returns a character or `null`
     */
    getOne(pos: Position): string | null {
        return convertOne(this.board[pos.row][pos.col]) ?? null
    }

    getScore(): number {
        return this.score
    }

    private calcScore(length: number): number {
        return Math.round(this.option.baseScore * length * Math.pow(this.option.lengthFactor, length))
    }

    /**
     * Combine a word from the given characters and check validity.  
     * If it is valid, score is automatically updated.
     * @param characters List of the positions of the selected characters.
     * @returns `true` if the combined word is valid, else `false`
     */
    makeWord(characters: Array<Position>): boolean {
        let buffer: string = ''
        characters.forEach((pos) => buffer += this.board[pos.row][pos.col])
        const word = convert(buffer)

        // TODO: check validity
        let isValid = true

        if (isValid) {
            this.score += this.calcScore(characters.length)

            characters.forEach((pos: Position) => {
                this.board[pos.row][pos.col] = this.generateOne(pos.row, pos.col)
            })

            return true
        } else return false
    }
}