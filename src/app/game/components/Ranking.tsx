// app/game/components/Ranking.tsx
'use client'

import React, { useState, useEffect } from 'react'
import AvatarIcon from '@/app/components/AvatarIcon'
import { AvatarIconName } from '@/app/stores/userStore'

const APIurl = process.env.NEXT_PUBLIC_API_URL;


interface RankingApiResponse {
  name: string;
  avatarIcon: AvatarIconName;
  avatarColor: string;
}

// 1. 요청 실패 시 보여줄 더미 랭킹 데이터를 생성합니다.
const getDummyRankings = (): RankingApiResponse[] => [
  { name: 'First Place', avatarIcon: 'LuDog', avatarColor: "#C4DEF0" },
  { name: 'Runner Up', avatarIcon: 'LuCat', avatarColor: "#C4DEF0" },
  { name: 'Bronze Medal', avatarIcon: 'LuDog', avatarColor: "#C4DEF0" },
  { name: 'Lucky Fourth', avatarIcon: 'BiFace', avatarColor: "#C4DEF0" },
  { name: 'Top Five', avatarIcon: 'LuDog' , avatarColor: "#C4DEF0"},
  { name: 'Player Six', avatarIcon: 'LuCat' , avatarColor: "#C4DEF0"},
  { name: 'Contender', avatarIcon: 'BiFace' , avatarColor: "#C4DEF0"},
  { name: 'Great Eight', avatarIcon: 'LuCat' , avatarColor: "#C4DEF0"},
  { name: 'Almost There', avatarIcon: 'LuDog' , avatarColor: "#C4DEF0"},
  { name: 'Top Ten', avatarIcon: 'LuCat' , avatarColor: "#C4DEF0"},
];

export default function Ranking(): React.JSX.Element {
  // 상태 관리: 순위 데이터, 로딩
  const [rankings, setRankings] = useState<RankingApiResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch(`${APIurl}/api/users/rankings`)
        if (!response.ok) {
          // 응답이 정상이 아니면 에러를 발생시켜 catch 블록으로 이동시킵니다.
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: RankingApiResponse[] = await response.json()
        setRankings(data)
      } catch (e) {
        console.error("Failed to fetch rankings, showing dummy data instead:", e)
        // 2. 에러 발생 시, rankings 상태를 더미 데이터로 설정합니다.
        setRankings(getDummyRankings())
      } finally {
        setIsLoading(false)
      }
    }

    fetchRankings()
  }, []) // 컴포넌트 마운트 시 한 번만 실행

  return (
    <div className="h-full flex flex-col">
      <h2 className="mb-1 pl-2 text-2xl font-medium">순위</h2>
      
      <ul className="flex flex-col flex-1 overflow-y-auto space-y-1">
        {isLoading ? (
          // 3. 로딩 중일 때 간단한 메시지를 표시합니다.
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>순위를 불러오는 중...</p>
          </div>
        ) : (
          // 로딩이 끝나면 실제 데이터 또는 더미 데이터가 렌더링됩니다.
          rankings.map((entry, idx) => (
            <li
              key={idx}
              className="flex flex-1 items-center space-x-2 text-gray-700 px-2 py-1"
            >
              <span className="w-6 text-right font-medium">{idx + 1}.</span>
              <AvatarIcon
                iconName={entry.avatarIcon}
                backgroundColor= {entry.avatarColor}
                size={24}
              />
              <span className="flex-1 truncate font-medium">{entry.name}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
