"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";

const APIurl = process.env.NEXT_PUBLIC_API_URL;


const MyPage = () => { 
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 폼 제출을 처리하는 비동기 함수
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 기본 폼 제출(새로고침) 방지
    
    // 1. 유효성 검사
    if (!newPassword || !confirmPassword) {
      alert("새 비밀번호와 비밀번호 확인을 모두 입력해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
      return;
    }

    setIsLoading(true); // 로딩 상태 시작

    try {
      const response = await fetch(`${APIurl}/api/users/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({ newPassword }), 
      });

      if (response.ok) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        router.push("/mypage"); // 성공 시 마이페이지로 이동
      } else {
        const errorData = await response.json();
        alert(`변경에 실패했습니다: ${errorData.message || '알 수 없는 오류가 발생했습니다.'}`);
      }
    } catch (error) {
      console.error("An error occurred during password change:", error);
      alert("네트워크 오류가 발생했습니다. 나중에 다시 시도해주세요.");
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <div className="mt-25" style={{ fontFamily: "NanumSquare" }}>
        {/* 2. form에 onSubmit 핸들러 연결 */}
        <form onSubmit={handleSave}>
          <div className="flex items-center gap-6 mb-8">
            <label className="w-28 text-right text-[#A5A5A5] text-base">
              새 비밀번호
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-100 h-15 border border-[#A5A5A5] rounded box-border px-4"
              disabled={isLoading} // 로딩 중 비활성화
            />
            <div className="w-28" />
          </div>
          <div className="flex items-center gap-6 mb-12">
            <label className="w-28 text-right text-[#A5A5A5] text-base">
              비밀번호 확인
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-100 h-15 border border-[#A5A5A5] rounded box-border px-4"
              disabled={isLoading} // 로딩 중 비활성화
            />
            <div className="w-28" />
          </div>
          <div
            className="flex justify-center gap-11"
            style={{ fontFamily: "NanumSquareBold" }}
          >
            <button
              type="button"
              className="w-35 h-15 border border-[#A5A5A5] text-center rounded box-border cursor-pointer disabled:opacity-50"
              onClick={() => router.push("/mypage")}
              disabled={isLoading} // 로딩 중 비활성화
            >
              취소
            </button>
            <button
              type="submit" // 3. 버튼 타입을 'submit'으로 변경
              className="w-35 h-15 bg-[#CBCBCB] border border-[#A5A5A5] text-center text-white rounded box-border cursor-pointer disabled:opacity-50"
              disabled={isLoading} // 로딩 중 비활성화
            >
              {/* 4. 로딩 상태에 따라 버튼 텍스트 변경 */}
              {isLoading ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyPage;
