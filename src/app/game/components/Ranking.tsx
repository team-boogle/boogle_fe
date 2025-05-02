// app/game/components/Ranking.tsx
'use client'

import React from 'react'

interface RankingEntry {
  name: string
}

export default function Ranking(): React.JSX.Element {
  // 임시 데이터: 1~10위 사용자 이름
  const entries: RankingEntry[] = Array.from({ length: 13 }, () => ({
    name: 'Best Player',
  }))

  return (
    <div className="h-full flex flex-col">
      {/* 섹션 제목 */}
      <h2 className="m-2 text-lg text-4xl font-medium">부글부글보글보글</h2>

      {/* 순위 리스트 */}
      <ul className="flex-1 overflow-y-auto space-y-2">
        {entries.map((entry, idx) => (
          <li
            key={idx}
            className="flex items-center space-x-2 text-gray-700"
          >
            {/* 순위 번호 */}
            <span className="w-5 text-right">{idx + 1}.</span>

            {/* 아이콘 플레이스홀더 */}
            <span className="w-4 h-4 bg-gray-300 rounded-full flex-shrink-0" />

            {/* 사용자 이름 */}
            <span className="flex-1 truncate">{entry.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
