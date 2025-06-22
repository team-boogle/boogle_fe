// app/components/AvatarIcon.tsx
import React from 'react';
import { iconMap } from './icons/IconMap';
import { AvatarIconName } from '@/app/stores/userStore';

interface AvatarIconProps {
  iconName: AvatarIconName;
  backgroundColor: string;
  size?: number; // size prop 추가 (단위: px)
}

export default function AvatarIcon({ iconName, backgroundColor, size = 48 }: AvatarIconProps) {

  const IconComponent = iconMap[iconName];

  if (!IconComponent) {
    return null; 
  }

  const iconSize = size / 2.2;

  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        backgroundColor: backgroundColor,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <IconComponent color="white" size={`${iconSize}px`} />
    </div>
  );
}
