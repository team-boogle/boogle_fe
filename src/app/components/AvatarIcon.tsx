// app/components/AvatarIcon.tsx
import React from 'react';
import { iconMap } from './icons/IconMap';
import { AvatarIconName } from '@/app/stores/userStore';

// [수정] size prop을 인터페이스에 추가합니다. (optional)
interface AvatarIconProps {
  iconName: AvatarIconName;
  backgroundColor: string;
  size?: number; // size prop 추가 (단위: px)
}

export default function AvatarIcon({ iconName, backgroundColor, size = 48 }: AvatarIconProps) {
  // [수정] size prop에 기본값을 48px로 설정합니다.

  const IconComponent = iconMap[iconName];

  if (!IconComponent) {
    return null; 
  }

  // [추가] 컨테이너 크기에 비례하여 내부 아이콘 크기를 계산합니다.
  // 약 2.2를 나누어 원래 비율(48px -> 20px)과 비슷하게 맞춥니다.
  const iconSize = size / 2.2;

  return (
    // [수정] 고정 클래스 'w-12 h-12'를 제거하고, 동적 스타일을 적용합니다.
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        backgroundColor: backgroundColor,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {/* [수정] 아이콘 컴포넌트의 size를 동적으로 할당합니다. */}
      <IconComponent color="white" size={`${iconSize}px`} />
    </div>
  );
}
