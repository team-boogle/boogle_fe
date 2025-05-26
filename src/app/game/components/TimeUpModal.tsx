// app/game/components/TimeUpModal.tsx
'use client'

import React from 'react'

interface TimeUpModalProps {
  open: boolean
  score: number
  onRetry: () => void
}

export default function TimeUpModal({ open, score, onRetry }: TimeUpModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white w-100 h-100 rounded-lg shadow-lg flex flex-col items-center justify-center">
        <div className="text-4xl">최고 점수</div>
        <div className="m-4 text-6xl">{score}점</div>
        <button
          onClick={onRetry}
          className="px-8 py-4 bg-black text-white rounded hover:bg-gray-600 transition text-2xl"
        >
          Retry
        </button>
      </div>
    </div>
  )
}
