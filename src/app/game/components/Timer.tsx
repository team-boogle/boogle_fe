// app/game/components/Timer.tsx
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
    <div className="flex flex-col items-center h-full">
      <div className="w-8 flex-[9_1_0%] bg-red-400 rounded-xl overflow-hidden">
        <div
          className="bg-gray-200 w-full transition-all duration-300"
          style={{ height: `${percent}%` }}
        />
      </div>
      <div className="flex-[1_1_0%] text-2xl font-medium flex items-end">{secondsLeft}</div>
    </div>
  )
}
