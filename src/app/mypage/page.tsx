"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../game/sections/Header";
import { useUserStore } from "../stores/userStore";
import AvatarIcon from "../components/AvatarIcon";
const APIurl = process.env.NEXT_PUBLIC_API_URL;


const MyPage = () => {
    const router = useRouter();
    const { user, logoutUser } = useUserStore();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        if (!user) {
            alert("로그인이 필요한 페이지입니다.");
            router.replace("/");
        } else {
            setAuthChecked(true);
        }
    }, [user, router]);

    const handleLogout = async () => {
        try {
            await fetch(`${APIurl}/api/logout`, { method: 'POST' });
        } catch (error) {
            console.error("로그아웃 API 호출 실패:", error);
        } finally {
            logoutUser();
        }
    };

    if (!authChecked || !user) {
        return <div className="min-h-screen flex justify-center items-center">로딩 중...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center">
            <Header 
                title="마이페이지" 
                nickname={user.nickname} 
                avatar={user.avatar} 
                avatarColor={user.avatarColor} 
            />
            <div className="flex flex-col items-center mt-15">
                {/* 2. 플레이스홀더 div를 AvatarIcon 컴포넌트로 교체합니다. */}
                {/* user.avatar가 존재할 때만 AvatarIcon을, 없으면 기존 플레이스홀더를 보여줍니다. */}
                {user.avatar ? (
                    <AvatarIcon iconName={user.avatar} backgroundColor={user.avatarColor} size={120}/>
                ) : (
                    <div className="w-25 h-25 rounded-full bg-[#ECECEC]" />
                )}

                <div className="space-y-11 my-12">
                    <div className="flex justify-center gap-8">
                        <span className="w-20 text-right text-[#A5A5A5]">아이디</span>
                        <span className="w-55">{user.username}</span>
                    </div>
                    <div className="flex justify-center gap-8">
                        <span className="w-20 text-right text-[#A5A5A5]">별명</span>
                        <span className="w-55">{user.nickname}</span>
                    </div>
                    <div className="flex justify-center gap-8">
                        <span className="w-20 text-right text-[#A5A5A5]">최고기록</span>
                        <span className="w-55">{user.highScore}점</span>
                    </div>
                </div>
                <div className="text-[#A5A5A5] space-x-4 mt-5" style={{ fontFamily: "NanumSquareBold" }}>
                    <button className="hover:underline cursor-pointer" onClick={() => router.push("/mypage/edit-profile")}>
                        프로필 수정
                    </button>
                    <span>|</span>
                    <button className="hover:underline cursor-pointer" onClick={() => router.push("/mypage/change-password")}>
                        비밀번호 변경
                    </button>
                    <span>|</span>
                    <button className="hover:underline cursor-pointer" onClick={handleLogout}>
                        로그아웃
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
