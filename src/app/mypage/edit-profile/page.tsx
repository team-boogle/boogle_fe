"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../stores/userStore";
import { MdOutlineTagFaces, MdOutlineFace4 } from "react-icons/md";
import { BiFace } from "react-icons/bi";
import { TbSunglasses } from "react-icons/tb";
import { LuCat, LuDog } from "react-icons/lu";

import Header from "../../components/Header";

const backgroundColors = [
  "#ECECEC", "#C4DEF0", "#CCE3AB", "#FFE5AC", "#FFB4B4", "#E2C8ED",
];
const characterIcons = [
  { id: "MdOutlineTagFaces", icon: <MdOutlineTagFaces size="70%" color="#5B5B5B" /> },
  { id: "MdOutlineFace4", icon: <MdOutlineFace4 size="70%" color="#5B5B5B" /> },
  { id: "BiFace", icon: <BiFace size="70%" color="#5B5B5B" /> },
  { id: "TbSunglasses", icon: <TbSunglasses size="70%" color="#5B5B5B" /> },
  { id: "LuCat", icon: <LuCat size="70%" color="#5B5B5B" /> },
  { id: "LuDog", icon: <LuDog size="70%" color="#5B5B5B" /> },
];

const APIurl = process.env.NEXT_PUBLIC_API_URL;

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useUserStore();

  // 1. 폼의 '현재 편집 중인 값'을 담을 로컬 상태를 선언합니다.
  const [nickname, setNickname] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 2. useEffect를 컴포넌트 최상단으로 이동시킵니다.
  //    페이지가 로드될 때, 전역 상태(user)로 로컬 상태(폼)를 초기화합니다.
  useEffect(() => {
    if (user) {
      // userStore의 필드명에 맞게 user.nickname 또는 user.username을 사용합니다.
      setNickname(user.nickname || user.username); 
      setSelectedColor(user.avatarColor);
      setSelectedIcon(user.avatar || "MdOutlineTagFaces"); // avatar가 null일 경우 기본값 설정
    }
  }, [user]); // user 객체가 로드되거나 변경될 때 이 효과가 실행됩니다.

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // 3. API로 보낼 데이터는 '로컬 상태'의 값들을 사용합니다.
    const profileData = {
      nickname: nickname,
      avatarIcon: selectedIcon,
      avatarColor: selectedColor,
    };

    try {
      const response = await fetch(`${APIurl}/api/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // 중요: 실제 앱에서는 인증 토큰을 함께 보내야 합니다.
          // 'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        // 4. API 호출 성공 시, 업데이트된 정보로 '전역 상태'를 갱신합니다.
        const updatedUser = {
          ...user!,
          nickname: nickname,
          username: user!.username, // username은 변경되지 않는다고 가정
          avatarColor: selectedColor,
          avatar: selectedIcon as any,
        };
        setUser(updatedUser);

        alert('프로필이 성공적으로 저장되었습니다.');
        router.push('/mypage');
      } else {
        const errorData = await response.json();
        alert(`저장에 실패했습니다: ${errorData.message || '서버 오류'}`);
      }
    } catch (error) {
      console.error('An error occurred during fetch:', error);
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // user 정보가 아직 로드되지 않았다면 로딩 화면을 보여줄 수 있습니다.
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <div className="flex flex-col items-center" style={{ fontFamily: "NanumSquare" }}>
        <div className="w-18 h-18 rounded-full flex items-center justify-center mt-8 mb-12" style={{ backgroundColor: selectedColor }}>
          {characterIcons.find((c) => c.id === selectedIcon)?.icon}
        </div>
        
        <form onSubmit={handleSave}>
          {/* 배경색 선택 */}
          <div className="flex items-center gap-6 mb-8">
            <label className="w-28 text-right text-[#A5A5A5] text-base">배경색</label>
            <div className="w-100 flex justify-between">
              {backgroundColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-14 h-14 rounded-full border-2 ${selectedColor === color ? "border-[#A5A5A5]" : "border-transparent"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  disabled={isLoading}
                />
              ))}
            </div>
            <div className="w-28" />
          </div>

          {/* 캐릭터 선택 */}
          <div className="flex items-center gap-6 mb-8">
            <label className="w-28 text-right text-[#A5A5A5] text-base">캐릭터</label>
            <div className="w-100 flex justify-between">
              {characterIcons.map((char) => (
                <button
                  key={char.id}
                  type="button"
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center ${selectedIcon === char.id ? "border-[#A5A5A5]" : "border-transparent"}`}
                  onClick={() => setSelectedIcon(char.id)}
                  disabled={isLoading}
                >
                  {char.icon}
                </button>
              ))}
            </div>
            <div className="w-28" />
          </div>

          {/* 별명 입력 */}
          <div className="flex items-center gap-6 mb-12">
            <label className="w-28 text-right text-[#A5A5A5] text-base">별명</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-100 h-15 border border-[#A5A5A5] rounded box-border px-4"
              disabled={isLoading}
            />
            <div className="w-28" />
          </div>

          {/* 버튼 */}
          <div className="flex justify-center gap-8" style={{ fontFamily: "NanumSquareBold" }}>
            <button
              type="button"
              className="w-35 h-15 border border-[#A5A5A5] text-center rounded box-border cursor-pointer disabled:opacity-50"
              onClick={() => router.push("/mypage")}
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className="w-35 h-15 bg-[#CBCBCB] border border-[#A5A5A5] text-center text-white rounded box-border cursor-pointer disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
