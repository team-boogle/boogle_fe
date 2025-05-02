// app/game/components/Score.tsx
'use client'

import React from 'react'

interface ScoreProps {
  score: number
}

export default function Score({ score }: ScoreProps): React.JSX.Element {
  return (
    <footer className="w-full pb-4 bg-white">
      <div className="text-3xl font-bold text-center">
        {score}
      </div>
    </footer>
  )
}
