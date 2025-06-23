"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Header from "../components/Header";

const APIurl = process.env.NEXT_PUBLIC_API_URL;

const SignupPage = () => {
	  const [email, setEmail] = useState("");
	  const [password, setPassword] = useState("");
	  const [confirmPassword, setConfirmPassword] = useState("");
	  const [nickname, setNickname] = useState("");

	  const router = useRouter();

	  const handleSubmit = async (e: React.FormEvent) => {
		    e.preventDefault();

        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const res = await fetch(`${APIurl}/api/sign_up`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email, password: password, nickName: nickname }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(res);
                alert(data.message || "회원가입에 실패했습니다.");
                return;
            }

            alert(data.message || "회원가입이 완료되었습니다.");
            router.push("/");

        } catch (error) {
            console.error("An error occurred during sign up:", error);
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center">
            <Header />
            <div className="flex items-start justify-center mt-15">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {[
                        { label: "아이디", type: "text", value: email, onChange: setEmail },
                        { label: "비밀번호", type: "password", value: password, onChange: setPassword },
                        { label: "비밀번호 확인", type: "password", value: confirmPassword, onChange: setConfirmPassword },
                        { label: "별명", type: "text", value: nickname, onChange: setNickname },
                    ].map((field, idx) => (
                        <div key={idx} className="flex items-center gap-6" style={{ fontFamily: "NanumSquare" }}>
                            <label className="w-28 text-right text-[#A5A5A5] text-base">{field.label}</label>
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
