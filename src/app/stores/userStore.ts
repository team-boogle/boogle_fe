// app/stores/userStore.ts
import { create } from 'zustand';

// --- 타입 정의는 그대로 유지 ---
export type AvatarIconName = 
  | 'MdOutlineTagFaces'
  | 'MdOutlineFace4'
  | 'BiFace'
  | 'TbSunglasses'
  | 'LuCat'
  | 'LuDog';

export interface User {
  username: string;
  nickname: string;
  highScore: number;
  avatarColor: string;
  avatar: AvatarIconName | null; 
}

// --- 상태와 액션 타입에서 isHydrated 관련 제거 ---
type State = {
  user: User | null;
}

type Actions = {
  setUser: (user: User | null) => void;
  logoutUser: () => void;
}

export const useUserStore = create<State & Actions>((set) => ({
  user: null,
  setUser: (user) => {
    console.log(" Zustand 스토어 업데이트! 변경될 데이터:", user);
    set({ user });
  },
  logoutUser: () => {
    console.log(" Zustand 스토어 로그아웃");
    set({ user: null });
  }
}));
