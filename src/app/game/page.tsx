// app/game/page.tsx
'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '../stores/userStore'
import Header from './sections/Header'
import MainGame from './sections/MainGame'

export default function GamePage(): React.JSX.Element {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    // 스토어에서 사용자 정보 확인이 끝났지만, user가 null인 경우 (로그인되지 않은 경우)
    // 로그인 페이지로 리다이렉트합니다.
    if (user === null) {
      router.push('/'); // 로그인 페이지 경로로 변경하세요.
    }
  }, [user, router]);

  // user 정보가 로드 중이거나, 리다이렉트 되기 전까지 로딩 화면을 표시합니다.
  if (!user) {
    return <div>로딩 중...</div>; 
  }
  
  // 사용자 정보가 있으면 페이지 콘텐츠를 렌더링합니다.
  return (
    <main className="flex flex-col h-screen">
      <Header 
        title="부글" 
        userName={user.username}
        avatar={user.avatar}
        avatarColor={user.avatarColor}
      />
      <MainGame />
    </main>
  )
}
