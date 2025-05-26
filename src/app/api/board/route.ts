// app/api/board/route.ts
import { NextResponse } from 'next/server'

// 자음(Jamo initial) 19자
const chars = [
  'ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ',
  'ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ',
  'ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ',
  'ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ',
  'ㅡ','ㅢ','ㅣ'
]

export async function GET() {
  const size = 10

  const board: string[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => {
      return chars[Math.floor(Math.random() * chars.length)]
    })
  )

  return NextResponse.json({ board })
}
