// app/game/sections/GameFooter.tsx
'use client'

import React from 'react';
import Score from '../components/Score';

interface GameFooterProps {
  score: number;
}

export default function GameFooter({ score }: GameFooterProps) {
  return (
    <footer className="grid place-items-center h-full">
      <Score score={score} />
    </footer>
  );
}
