// app/components/icons/IconMap.tsx
import { IconType } from 'react-icons';
import { MdOutlineTagFaces, MdOutlineFace4 } from 'react-icons/md';
import { BiFace } from 'react-icons/bi';
import { TbSunglasses } from 'react-icons/tb';
import { LuCat, LuDog } from 'react-icons/lu';
import { AvatarIconName } from '@/app/stores/userStore'; // 경로 확인

// 문자열 키와 아이콘 컴포넌트를 매핑
export const iconMap: Record<AvatarIconName, IconType> = {
  MdOutlineTagFaces,
  MdOutlineFace4,
  BiFace,
  TbSunglasses,
  LuCat,
  LuDog,
};
