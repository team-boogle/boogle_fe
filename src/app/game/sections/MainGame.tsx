'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Board, defaultBoardOption } from '@/utils/board'
import Refresh from '../components/Refresh'
import Timer from '../components/Timer'
import BoardView from '../components/BoardView'
import Ranking from '../components/Ranking'
import Score from '../components/Score'
import TimeUpModal from '../components/TimeUpModal'
import { convertOne, convert } from "@/utils/hangeul"
import CurrentPhonemes from '../components/Phonemems'

export default function MainGame(): React.JSX.Element {
  const boardRef = useRef<Board>(new Board(10, defaultBoardOption))
  const [tiles, setTiles] = useState(boardRef.current.getAll())
  const [score, setScore] = useState(boardRef.current.getScore())
  const [isTimeUp, setIsTimeUp] = useState(false)
  const [foundWords, setFoundWords] = useState<{ word: string; score: number }[]>([])
  const [invalidTiles, setInvalidTiles] = useState<Set<string>>(new Set())
  const [timerKey, setTimerKey] = useState(0)
  const [currentPath, setCurrentPath] = useState<{ row: number; col: number; letter: string }[]>([]);

  const handleRetry = () => {
    boardRef.current = new Board(10, defaultBoardOption)
    setTiles(boardRef.current.getAll())
    setScore(boardRef.current.getScore())
    setFoundWords([])
    setInvalidTiles(new Set())
    setIsTimeUp(false)
    setTimerKey(prev => prev + 1)
  }

  const handleRefresh = useCallback(() => {
    boardRef.current = new Board(10, defaultBoardOption)
    setTiles(boardRef.current.getAll())
    setScore(boardRef.current.getScore())
    setInvalidTiles(new Set())
  }, [])

  const handleSelectionEnd = useCallback(async (
    path: { row: number; col: number; letter: string }[]
  ) => {
    const positions = path.map(({ row, col }) => ({ row, col }))
    const isValid = await boardRef.current.makeWord(positions)
    if (isValid != false) {
      setTiles([...boardRef.current.getAll()])
      const newScore = boardRef.current.getScore()
      const delta = newScore - score;
      setFoundWords(prev => [...prev, { word: isValid as string, score: delta }])
      setScore(newScore);
      setInvalidTiles(prev => {
        const next = new Set(prev)
        path.forEach(t => next.delete(`${t.row},${t.col}`))
        return next
      })
    }
  }, [score])

  const handleTimeExpire = useCallback(() => {
    setIsTimeUp(true)
  }, [])

  return (
    <div className='w-full h-screen grid grid-rows-[1fr_auto]'>
      <section className="grid grid-cols-[3.5fr_3fr_3.5fr]">

        {/* 왼쪽 aside */}
        <aside className="pl-20 flex flex-col min-h-0">
          <div className='grid grid-cols-10 space-x-4 flex-1 min-h-0'>
            <div className='col-span-8 flex flex-col pt-4'>
              <h3 className="font-medium mb-2 text-2xl flex-shrink-0">찾은 단어</h3>
              <ul className="flex-1 flex flex-col overflow-y-auto overscroll-contain">
                {foundWords.slice(-12).map(({ word, score }, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center rounded text-sm mb-2 last:mb-auto"
                  >
                    <span className="truncate text-lg font-medium">{word}</span>
                    <span className="ml-2 flex-shrink-0 text-lg font-medium">+{score}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className='col-span-2 grid grid-rows-[1fr_9fr] h-full'>
              <div className="grid place-items-center">
                <Refresh onRefresh={handleRefresh} />
              </div>
              <Timer key={timerKey} duration={200} onExpire={handleTimeExpire} />
            </div>
          </div>
        </aside>

        {/* 중앙 section */}
        <section className="grid grid-rows-[9fr_1fr] min-h-0">
          <div className="grid place-items-center min-h-0">
            <BoardView
              tiles={tiles}
              invalidTiles={invalidTiles}
              onSelectionEnd={handleSelectionEnd}
              onPathChange={setCurrentPath}
            />
          </div>
          <div className="flex justify-center items-center min-w-0 min-h-0">
            <CurrentPhonemes path={currentPath} />
          </div>
        </section>

        {/* --- 여기부터 수정된 부분 --- */}
        {/* 1. flex flex-col을 grid grid-rows-[9fr_1fr]로 변경 */}
        <aside className="pl-8 grid grid-rows-[9fr_1fr] min-h-0">
          {/* 2. Ranking 컴포넌트를 9fr 공간에 배치하고, 스크롤 처리 */}
          <div className="overflow-y-auto overscroll-contain min-h-0">
             <Ranking />
          </div>
          {/* 3. 1fr 만큼의 빈 공간 */}
          <div></div> 
        </aside>
        {/* --- 여기까지 수정된 부분 --- */}

      </section>

      <footer className="grid place-items-center px-8 py-2">
        <Score score={score} />
      </footer>

      <TimeUpModal open={isTimeUp} score={score} onRetry={handleRetry} />
    </div>
  )
}
