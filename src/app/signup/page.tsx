"use client";

import { useState } from "react";

import Header from "../components/Header";

const APIurl = process.env.NEXT_PUBLIC_API_URL;

const SignupPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [nickname, setNickname] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("비밀번호가 일치하지 않습니다.");
			return;
		}

		const res = await fetch(`${APIurl}/api/sign_up`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email: email, password: password, nickName: nickname }),
		});

		if (!res.ok) {
			console.error(res);
			return;
		}

		const data = await res.json();
		alert(data.message);

	};

	return (
		<div className="min-h-screen flex flex-col items-center">
			<Header />
			<div className="flex items-start justify-center mt-15">
				<form onSubmit={handleSubmit} className="space-y-6">
					{[
						{
							label: "이메일",
							type: "email",
							value: email,
							onChange: setEmail,
						},
						{
							label: "비밀번호",
							type: "password",
							value: password,
							onChange: setPassword,
						},
						{
							label: "비밀번호 확인",
							type: "password",
							value: confirmPassword,
							onChange: setConfirmPassword,
						},
						{
							label: "별명",
							type: "text",
							value: nickname,
							onChange: setNickname,
						},
					].map((field, idx) => (
						<div key={idx} className="flex items-center gap-6" style={{ fontFamily: "NanumSquare" }}>
							<label className="w-28 text-right text-[#A5A5A5] text-base">
								{field.label}
							</label>
							<input
								type={field.type}
								value={field.value}
								onChange={(e) => field.onChange(e.target.value)}
								className="w-100 h-15 border border-[#A5A5A5] rounded box-border px-4"
							/>
							<div className="w-28" />
						</div>
					))}

					<div className="flex items-center gap-6">
						<div className="w-28" />
						<button
							type="submit"
							className="w-100 h-15 bg-[#CBCBCB] border border-[#A5A5A5] rounded text-base text-white cursor-pointer"
							style={{ fontFamily: "NanumSquareBold" }}
						>
							회원가입
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignupPage;
