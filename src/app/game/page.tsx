// app/game/page.tsx
'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 컴포넌트 임포트 경로를 수정합니다.
import { useUserStore } from '../stores/userStore';
import { Board, defaultBoardOption } from '@/utils/board';
import Header from './sections/Header';
import GameArea from './sections/GameArea';
import GameFooter from './sections/GameFooter';
import TimeUpModal from './components/TimeUpModal';

export default function GamePage(): React.JSX.Element {
  const { user } = useUserStore();
  const router = useRouter();

  // --- MainGame.tsx에서 옮겨온 모든 상태와 로직 ---
  const boardRef = useRef<Board>(new Board(10, defaultBoardOption));
  const [tiles, setTiles] = useState(boardRef.current.getAll());
  const [score, setScore] = useState(boardRef.current.getScore());
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [foundWords, setFoundWords] = useState<{ word: string; score: number }[]>([]);
  const [invalidTiles, setInvalidTiles] = useState<Set<string>>(new Set());
  const [timerKey, setTimerKey] = useState(0);
  const [currentPath, setCurrentPath] = useState<{ row: number; col: number; letter: string }[]>([]);

  const handleRetry = () => {
    boardRef.current = new Board(10, defaultBoardOption);
    setTiles(boardRef.current.getAll());
    setScore(boardRef.current.getScore());
    setFoundWords([]);
    setInvalidTiles(new Set());
    setIsTimeUp(false);
    setTimerKey(prev => prev + 1);
  };

  const handleRefresh = useCallback(() => {
    boardRef.current = new Board(10, defaultBoardOption);
    setTiles(boardRef.current.getAll());
    setScore(boardRef.current.getScore());
    setInvalidTiles(new Set());
  }, []);

  const handleSelectionEnd = useCallback(async (path: { row: number; col: number; letter: string }[]) => {
    const positions = path.map(({ row, col }) => ({ row, col }));
    const isValid = await boardRef.current.makeWord(positions);
    if (isValid !== false) {
      setTiles([...boardRef.current.getAll()]);
      const newScore = boardRef.current.getScore();
      const delta = newScore - score;
      setFoundWords(prev => [...prev, { word: isValid as string, score: delta }]);
      setScore(newScore);
      setInvalidTiles(prev => {
        const next = new Set(prev);
        path.forEach(t => next.delete(`${t.row},${t.col}`));
        return next;
      });
    }
  }, [score]);

  const handleTimeExpire = useCallback(() => {
    setIsTimeUp(true);
  }, []);

  useEffect(() => {
    if (user === null) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return <div>로딩 중...</div>;
  }

  return (
    // --- 최종 레이아웃 구성 ---
    // h-screen과 grid-rows를 사용하여 1:8:1 비율로 나눕니다.
    <main className="grid grid-rows-[1fr_8fr_1fr] h-screen">
      <Header
        title="부글"
        userName={user.username}
        avatar={user.avatar}
        avatarColor={user.avatarColor}
      />
      
      {/* 분리된 컴포넌트에 상태와 핸들러를 props로 전달합니다. */}
      <GameArea
        tiles={tiles}
        invalidTiles={invalidTiles}
        foundWords={foundWords}
        currentPath={currentPath}
        timerKey={timerKey}
        onSelectionEnd={handleSelectionEnd}
        onPathChange={setCurrentPath}
        onRefresh={handleRefresh}
        onTimeExpire={handleTimeExpire}
      />
      
      <GameFooter score={score} />

      {/* TimeUpModal은 레이아웃에 영향을 주지 않으므로 여기에 둡니다. */}
      <TimeUpModal open={isTimeUp} score={score} onRetry={handleRetry} />
    </main>
  );
}
