// app/game/page.tsx
'use client'

import React from 'react'
import Header from './sections/Header'
import MainGame from './sections/MainGame'

export default function GamePage(): React.JSX.Element {
  return (
    <main className="flex flex-col h-screen">
      <Header title="BOGGLE" userName="user1" />
      <MainGame />
      
    </main>
  )
}
