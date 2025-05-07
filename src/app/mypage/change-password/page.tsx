"use client";

import { useState } from "react";

const MyPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

	return (
		<div className="min-h-screen flex flex-col items-center">
			<div className="h-35 flex items-center justify-center">
				<h1
					className="text-4xl"
					style={{ fontFamily: "Paperlogy-8ExtraBold" }}
				>
					부글
				</h1>
			</div>
			<div
				className="flex flex-col items-center mt-25"
				style={{ fontFamily: "NanumSquare" }}
			>
				<form className="space-y-6 items-center">
					<div className="flex items-center gap-6">
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
					<div className="flex items-center gap-6">
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
					<div className="flex justify-center gap-8">
						<button className="w-35 h-15 border border-[#A5A5A5] text-center rounded box-border">
							취소
						</button>
						<button className="w-35 h-15 bg-[#CBCBCB] border border-[#A5A5A5] text-center text-white rounded box-border">
							저장하기
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default MyPage;
