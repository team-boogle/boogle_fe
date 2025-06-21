'use client'

import React, { useEffect, useState } from 'react'

interface TimerProps {
  duration: number         // 총 시간(초)
  onExpire?: () => void    // 타임아웃 콜백(선택)
}

export default function Timer({
  duration,
  onExpire,
}: TimerProps): React.JSX.Element {
  const [secondsLeft, setSecondsLeft] = useState(duration)

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire?.()
      return
    }
    const id = setInterval(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(id)
  }, [secondsLeft, onExpire])

  const percent = Math.max(0, ((duration - secondsLeft) / duration) * 100)

  return (
    <div className="grid grid-rows-[8fr_1fr] h-full w-full">
      {/* 타이머 바 (8 부분) */}
      <div className="w-8 bg-red-400 rounded-xl overflow-hidden justify-self-center">
        <div
          className="bg-gray-200 w-full transition-all duration-300"
          style={{ height: `${percent}%` }}
        />
      </div>
      {/* 남은 시간 텍스트 (1 부분) */}
      <div className="text-2xl font-medium flex justify-center items-end">
        {secondsLeft}
      </div>
    </div>
  )
}
