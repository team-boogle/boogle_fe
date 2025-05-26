// app/game/components/Header.tsx
import React from 'react'
import Image from 'next/image'

interface HeaderProps {
  title: string
  userName: string
  avatarUrl?: string
}

export default function Header({
  title,
  userName,
  avatarUrl,
}: HeaderProps) {
  return (
    <header className="flex items-center px-8 py-8 bg-white flex-[1_1_0%]">
      {/* 1) 빈 칸 */}
      <div className='flex-[1.5_1_15%]'/>

      {/* 2) 중앙 제목 */}
      <h1 className="flex-[7_1_70%] col-span-1 text-center text-4xl font-extrabold">{title}</h1>

      {/* 3) 오른쪽 사용자 정보 */}
      <div className="flex flex-[1.5_1_15%] items-center space-x-3">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={`${userName} avatar`}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-gray-700-base font-medium">{userName}</span> 
      </div>
    </header>
  )
}
