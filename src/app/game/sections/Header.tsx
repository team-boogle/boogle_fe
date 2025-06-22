'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/stores/userStore';
import AvatarIcon from '@/app/components/AvatarIcon';
import { AvatarIconName } from '@/app/stores/userStore';

interface HeaderProps {
  title: string;
  userName: string;
  avatar: AvatarIconName | null;
  avatarColor: string;
}

export default function Header({ title, userName, avatar, avatarColor }: HeaderProps) {
  const router = useRouter();
  const { logoutUser } = useUserStore();

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error("로그아웃 API 호출 실패:", error);
    } finally {
      logoutUser();
      router.push('/');
    }
  };

  const handleNavigateToMyPage = () => {
    router.push('/mypage');
  };

  return (
    // [수정] items-center -> items-baseline 으로 변경하여 모든 요소의 텍스트 기준선을 맞춥니다.
    <header className="grid grid-cols-[1fr_auto_1fr] items-baseline px-8 py-4 bg-white w-full">
      
      {/* 1번째 컬럼 (왼쪽 공간) */}
      <div></div>

      {/* 2번째 컬럼 (중앙 타이틀) */}
      <h1 className="text-center text-4xl font-extrabold">{title}</h1>

      {/* 3번째 컬럼 (오른쪽 사용자 정보) */}
      {/* 내부 요소들도 baseline 정렬을 위해 items-baseline을 추가해주는 것이 좋습니다. */}
      <div className="flex justify-end items-center space-x-4">
        {/* 아바타 아이콘은 텍스트가 아니므로, flex-shrink-0을 추가해 레이아웃이 틀어지는 것을 방지할 수 있습니다. */}
        {avatar ? (
          <div className="flex-shrink-0">
            <AvatarIcon iconName={avatar} backgroundColor={avatarColor} size={48}/>
          </div>
        ) : (
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-400 text-white font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
        )}

        <span className="text-gray-700 font-medium">{userName}</span>
        
        {avatar && (
          <button 
            onClick={handleLogout}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            로그아웃
          </button>
        )}

        {avatar && (
          <button 
            onClick={handleNavigateToMyPage}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            마이페이지
          </button>
        )}
      </div>
    </header>
  );
}
