'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/stores/userStore';
import AvatarIcon from '@/app/components/AvatarIcon';
import { AvatarIconName } from '@/app/stores/userStore';
const APIurl = process.env.NEXT_PUBLIC_API_URL;

interface HeaderProps {
  title: string;
  nickname: string;
  avatar: AvatarIconName | null;
  avatarColor: string;
}

export default function Header({ title, nickname, avatar, avatarColor }: HeaderProps) {
  const router = useRouter();
  const { logoutUser } = useUserStore();

  const handleLogout = async () => {
    try {
      await fetch(`${APIurl}/api/logout`, { method: 'POST' });
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
    <header className="grid grid-cols-[1fr_auto_1fr] items-center px-8 py-4 bg-white w-full">
      
      {/* 1번째 컬럼 (왼쪽 공간) */}
      <div></div>

      {/* 2번째 컬럼 (중앙 타이틀) */}
      <h1 className="text-center text-4xl font-extrabold">{title}</h1>

      {/* 3번째 컬럼 (오른쪽 사용자 정보) */}
      <div className="flex justify-end items-center space-x-4">
        {avatar ? (
          <div className="flex-shrink-0">
            <AvatarIcon iconName={avatar} backgroundColor={avatarColor} size={48}/>
          </div>
        ) : (
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-400 text-white font-bold">
            {nickname.charAt(0).toUpperCase()}
          </div>
        )}

        <span className="text-gray-700 font-medium">{nickname}</span>
        
        {nickname && (
          <button 
            onClick={handleLogout}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            로그아웃
          </button>
        )}

        {nickname && (
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
