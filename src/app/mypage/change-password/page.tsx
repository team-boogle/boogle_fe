"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Header from "../../components/Header";

const MyPage = () => {
	const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

	return (
		<div className="min-h-screen flex flex-col items-center">
			<Header />
			<div className="mt-25" style={{ fontFamily: "NanumSquare" }}>
				<form>
					<div className="flex items-center gap-6 mb-8">
						<label className="w-28 text-right text-[#A5A5A5] text-base">
							새 비밀번호
						</label>
						<input
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							className="w-100 h-15 border border-[#A5A5A5] rounded box-border px-4"
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
						/>
						<div className="w-28" />
					</div>
					<div
						className="flex justify-center gap-11"
						style={{ fontFamily: "NanumSquareBold" }}
					>
						<button
							type="button" 
							className="w-35 h-15 border border-[#A5A5A5] text-center rounded box-border cursor-pointer" 
							onClick={() => router.push("/mypage")}
						>
							취소
						</button>
						<button 
							className="w-35 h-15 bg-[#CBCBCB] border border-[#A5A5A5] text-center text-white rounded box-border cursor-pointer"
						>
							저장하기
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default MyPage;
