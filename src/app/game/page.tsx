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

const APIurl = process.env.NEXT_PUBLIC_API_URL;

export default function GamePage(): React.JSX.Element {
  // 스토어 및 라우터는 그대로 사용
  const { user, setUser } = useUserStore();
  const router = useRouter();

  // 게임 관련 상태 및 로직은 그대로 사용
  const boardRef = useRef<Board>(new Board(10, defaultBoardOption));
  const [tiles, setTiles] = useState(boardRef.current.getAll());
  const [score, setScore] = useState(boardRef.current.getScore());
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [foundWords, setFoundWords] = useState<{ word: string; score: number }[]>([]);
  const [invalidTiles, setInvalidTiles] = useState<Set<string>>(new Set());
  const [timerKey, setTimerKey] = useState(0);
  const [currentPath, setCurrentPath] = useState<{ row: number; col: number; letter: string }[]>([]);

  // 1. 최고 점수 갱신을 위한 useEffect 추가
  useEffect(() => {
    // 게임이 종료되었고, 로그인한 유저 정보가 있으며, 현재 점수가 최고 점수보다 높을 때만 실행
    if (isTimeUp && user && score > user.highScore) {
      
      const updateHighScore = async () => {
        console.log(`New high score! Updating from ${user.highScore} to ${score}`);

        // 2. 클라이언트 상태 우선 업데이트 (Optimistic Update)
        const updatedUser = { ...user, highScore: score };
        setUser(updatedUser);

        try {
          // 3. 서버에 최고 점수 저장
          const response = await fetch(`${APIurl}/api/users/highscore`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              // 예시: 'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ highScore: score }),
          });

          if (!response.ok) {
            console.error('Failed to update high score on the server.');
            // 실패 시, 원래 점수로 롤백할 수도 있습니다.
            // setUser(user); 
          }
        } catch (error) {
          console.error('An error occurred while updating high score:', error);
        }
      };

      updateHighScore();
    }
  }, [isTimeUp, score, user, setUser]); // 의존성 배열에 필요한 모든 값을 추가합니다.

  // --- 나머지 함수들은 그대로 유지 ---
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
  
  // --- JSX 렌더링 부분은 그대로 유지 ---
  return (
    <main className="grid grid-rows-[1fr_7fr_1fr] h-screen">
      <Header
        title="부글"
        nickname={user.nickname}
        avatar={user.avatar}
        avatarColor={user.avatarColor}
      />
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
      <TimeUpModal open={isTimeUp} score={score} onRetry={handleRetry} />
    </main>
  );
}
