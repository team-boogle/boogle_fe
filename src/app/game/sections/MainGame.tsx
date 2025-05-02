// app/game/page.tsx
'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Board, defaultBoardOption } from '@/utils/board'
import Refresh from '../components/Refresh'
import Timer from '../components/Timer'
import BoardView from '../components/BoardView'
import Ranking from '../components/Ranking'
import Score from '../components/Score'
import TimeUpModal from '../components/TimeUpModal'

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
  const handleSelectionEnd = useCallback((
    path: { row: number; col: number; letter: string }[]
  ) => {
    const positions = path.map(({ row, col }) => ({ row, col }))
    
    // Board 클래스의 검증 및 점수 계산
    const isValid = boardRef.current.makeWord(positions)
    
    if (isValid) {
      setTiles([...boardRef.current.getAll()])
      setScore(boardRef.current.getScore())
      
      // 찾은 단어 기록
      const word = path.map(t => t.letter).join('')
      const delta = boardRef.current.getScore() - score
      setFoundWords(prev => [...prev, { word, score: delta }])
      
      // 무효 타일 제거
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
    <div className='w-full flex-[10_1_0%] flex flex-col'>
      <section className="flex flex-1">
        {/* 컨트롤 패널 */}
        <aside className="flex flex-[3.5_1_0%] h-full pl-4 space-y-4">
          <div className='flex-[8_1_0%] h-full'>
            <div className="pt-4">
              <h3 className="font-medium mb-2">찾은 단어</h3>
              <ul className="space-y-1 max-h-48 overflow-y-auto">
                {foundWords.slice().reverse().map(({ word, score }, idx) => (
                  <li
                    key={foundWords.length - idx}
                    className="flex justify-between items-center px-2 py-1 bg-green-50 rounded text-sm"
                  >
                    <span className="truncate">{word}</span>
                    <span className="ml-2 font-semibold">+{score}</span>
                  </li>
                ))}
              </ul>
              {foundWords.length > 0 && (
                <div className="">
                </div>
              )}
            </div>
          </div>
          
          {/* 타이머 및 리프레시 */}
          <div className='flex flex-[2_1_0%] flex-col h-full items-center'>
            <Refresh onRefresh={handleRefresh} />
            <Timer key={timerKey} duration={100} onExpire={handleTimeExpire} />
          </div>
        </aside>

        {/* 게임 보드 */}
        <section className="flex-[3_1_0%] flex items-center justify-center">
          <BoardView
            tiles={tiles}
            invalidTiles={invalidTiles}
            onSelectionEnd={handleSelectionEnd}
          />
        </section>

        {/* 랭킹 */}
        <aside className="flex-[3.5_1_0%] pl-8 overflow-y-auto">
          <Ranking />
        </aside>
      </section>

      {/* 점수 표시 */}
      <footer className="px-8 py-2 flex-1 flex items-center justify-center">
        <Score score={score} />
      </footer>

      {/* 타임업 모달 */}
      <TimeUpModal open={isTimeUp} score={score} onRetry={handleRetry} />
    </div>
  )
}
