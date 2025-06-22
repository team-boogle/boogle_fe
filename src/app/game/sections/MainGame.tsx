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
  // Board 인스턴스 참조
  const boardRef = useRef<Board>(new Board(10, defaultBoardOption))
  // 상태 관리
  const [tiles, setTiles] = useState(boardRef.current.getAll())
  const [score, setScore] = useState(boardRef.current.getScore())
  const [isTimeUp, setIsTimeUp] = useState(false)
  const [foundWords, setFoundWords] = useState<{ word: string; score: number }[]>([])
  const [invalidTiles, setInvalidTiles] = useState<Set<string>>(new Set())
  const [timerKey, setTimerKey] = useState(0)
  const [currentPath, setCurrentPath] = useState<{ row: number; col: number; letter: string }[]>([]);

  // 게임 리셋 핸들러
  const handleRetry = () => {
    boardRef.current = new Board(10, defaultBoardOption)
    setTiles(boardRef.current.getAll())
    setScore(boardRef.current.getScore())
    setFoundWords([])
    setInvalidTiles(new Set())
    setIsTimeUp(false)
    setTimerKey(prev => prev + 1)
  }

  // 새로고침 핸들러
  const handleRefresh = useCallback(() => {
    boardRef.current = new Board(10, defaultBoardOption)
    setTiles(boardRef.current.getAll())
    setScore(boardRef.current.getScore())
    setInvalidTiles(new Set())
  }, [])

  // 선택 완료 핸들러
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

  // 타이머 만료 핸들러
  const handleTimeExpire = useCallback(() => {
    setIsTimeUp(true)
  }, [])

  return (
    <div className='w-full h-screen grid grid-rows-[1fr_auto]'>
      <section className="grid grid-cols-[3.5fr_3fr_3.5fr]">
        
        <aside className="grid grid-cols-10 pl-20 space-x-4 h-full">
          <div className='col-span-8 grid grid-rows-[auto_1fr] pt-4 min-h-0 h-full'>
            <h3 className="font-medium mb-2 text-2xl flex-shrink-0">찾은 단어</h3>
            
            <ul className="flex-1 flex flex-col">
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
        </aside>

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

        <aside className="pl-8 overflow-y-auto overscroll-contain h-full">
          <Ranking />
        </aside>
      </section>

      <footer className="grid place-items-center px-8 py-2">
        <Score score={score} />
      </footer>

      <TimeUpModal open={isTimeUp} score={score} onRetry={handleRetry} />
    </div>
  )
}
