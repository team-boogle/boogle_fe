// app/game/sections/GameArea.tsx
'use client'

import React from 'react';
import Refresh from '../components/Refresh';
import Timer from '../components/Timer';
import BoardView from '../components/BoardView';
import Ranking from '../components/Ranking';
import CurrentPhonemes from '../components/Phonemems';

interface GameAreaProps {
  tiles: string[][];
  invalidTiles: Set<string>;
  foundWords: { word: string; score: number }[];
  currentPath: { row: number; col: number; letter: string }[];
  timerKey: number;
  onSelectionEnd: (path: { row: number; col: number; letter: string }[]) => void;
  onPathChange: (path: { row: number; col: number; letter: string }[]) => void;
  onRefresh: () => void;
  onTimeExpire: () => void;
}

export default function GameArea({
  tiles,
  invalidTiles,
  foundWords,
  currentPath,
  timerKey,
  onSelectionEnd,
  onPathChange,
  onRefresh,
  onTimeExpire,
}: GameAreaProps) {
  return (
    <section className="grid grid-cols-[3.5fr_3fr_3.5fr] h-full min-h-0">
      {/* 왼쪽 aside */}
      <aside className="pl-20 flex flex-col min-h-0">
        <div className='grid grid-cols-10 space-x-4 flex-1 min-h-0'>
          <div className='col-span-8 flex flex-col pt-4'>
            <h3 className="font-medium mb-2 text-2xl flex-shrink-0">찾은 단어</h3>
            <ul className="flex-1 flex flex-col overflow-y-auto overscroll-contain">
              {foundWords.slice(-12).map(({ word, score }, idx) => (
                <li key={idx} className="flex justify-between items-center rounded text-sm mb-2 last:mb-auto">
                  <span className="truncate text-lg font-medium">{word}</span>
                  <span className="ml-2 flex-shrink-0 text-lg font-medium">+{score}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className='col-span-2 grid grid-rows-[1fr_9fr] h-full'>
            <div className="grid place-items-center">
              <Refresh onRefresh={onRefresh} />
            </div>
            <Timer key={timerKey} duration={100} onExpire={onTimeExpire} />
          </div>
        </div>
      </aside>

      {/* 중앙 section */}
      <section className="grid grid-rows-[9fr_1fr] min-h-0">
        <div className="grid place-items-center min-h-0">
          <BoardView
            tiles={tiles}
            invalidTiles={invalidTiles}
            onSelectionEnd={onSelectionEnd}
            onPathChange={onPathChange}
          />
        </div>
        <div className="flex justify-center items-center min-w-0 min-h-0">
          <CurrentPhonemes path={currentPath} />
        </div>
      </section>

      {/* 오른쪽 aside */}
      <aside className="pl-8 grid grid-rows-[9fr_1fr] min-h-0">
        <div className="min-h-0 h-full">
          <Ranking />
        </div>
        <div></div>
      </aside>
    </section>
  );
}
