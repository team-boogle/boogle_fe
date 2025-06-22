"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function EditProfilePage() {
  const router = useRouter();

  const [nickname, setNickname] = useState("별명");
  const [selectedColor, setSelectedColor] = useState("#ECECEC");
  const [selectedIcon, setSelectedIcon] = useState("MdOutlineTagFaces");
  
  // 1. 로딩 상태를 관리할 state 추가
  const [isLoading, setIsLoading] = useState(false);

  // 2. 폼 제출을 처리할 비동기 함수 생성
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출 시 새로고침 방지
    setIsLoading(true); // 로딩 시작

    const profileData = {
      nickname: nickname,
      avatarIcon: selectedIcon,
      avatarColor: selectedColor,
    };

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        alert('프로필이 성공적으로 저장되었습니다.');
        router.push('/mypage'); // 성공 시 마이페이지로 이동
      } else {
        // 서버에서 보낸 에러 메시지를 표시
        const errorData = await response.json();
        alert(`저장에 실패했습니다: ${errorData.message || '서버 오류가 발생했습니다.'}`);
      }
    } catch (error) {
      console.error('An error occurred during fetch:', error);
      alert('네트워크 오류가 발생했습니다. 나중에 다시 시도해주세요.');
    } finally {
      setIsLoading(false); // 로딩 종료 (성공/실패 무관)
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <div className="flex flex-col items-center" style={{ fontFamily: "NanumSquare" }}>
        <div className="w-18 h-18 rounded-full flex items-center justify-center mt-8 mb-12" style={{ backgroundColor: selectedColor }}>
          {characterIcons.find((c) => c.id === selectedIcon)?.icon}
        </div>

        {/* 3. form에 onSubmit 이벤트 핸들러 연결 */}
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
                  disabled={isLoading} // 로딩 중 비활성화
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
                  disabled={isLoading} // 로딩 중 비활성화
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
              disabled={isLoading} // 로딩 중 비활성화
            />
            <div className="w-28" />
          </div>

          {/* 버튼 */}
          <div className="flex justify-center gap-8" style={{ fontFamily: "NanumSquareBold" }}>
            <button
              type="button"
              className="w-35 h-15 border border-[#A5A5A5] text-center rounded box-border cursor-pointer disabled:opacity-50"
              onClick={() => router.push("/mypage")}
              disabled={isLoading} // 로딩 중 비활성화
            >
              취소
            </button>
            <button
              type="submit" // 4. 저장 버튼의 type을 'submit'으로 변경
              className="w-35 h-15 bg-[#CBCBCB] border border-[#A5A5A5] text-center text-white rounded box-border cursor-pointer disabled:opacity-50"
              disabled={isLoading} // 로딩 중 비활성화
            >
              {/* 5. 로딩 상태에 따라 버튼 텍스트 변경 */}
              {isLoading ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
