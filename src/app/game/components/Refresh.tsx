// app/game/components/Refresh.tsx
'use client'

import React from 'react'

interface RefreshProps {
  onRefresh: () => void
}

export default function Refresh({ onRefresh }: RefreshProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onRefresh}
      aria-label="보드 뒤집기"
      className="p-2 rounded-full hover:bg-gray-100 transition"
    >
      <img src="/icons/refresh.svg" alt="로고" className="w-8 h-8 text-gray-100"/>
    </button>
  )
}
