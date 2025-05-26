// app/api/board/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const size = 5
  const board: string[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => {
      // 랜덤 자음·모음 인덱스 선택
      const cho = Math.floor(Math.random() * INITIALS.length)
      const jung = Math.floor(Math.random() * MEDIALS.length)
      // 초성*21 + 중성 → code offset 계산, 종성은 0 (없음)
      const syllableCode = 0xac00 + (cho * 21 + jung) * 28
      return String.fromCharCode(syllableCode)
    })
  )

  return NextResponse.json({ board })
}
