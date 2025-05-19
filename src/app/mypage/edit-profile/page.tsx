"use client";

import { useState } from "react";

import { MdOutlineTagFaces, MdOutlineFace4 } from "react-icons/md";
import { BiFace } from "react-icons/bi";
import { TbSunglasses } from "react-icons/tb";
import { LuCat, LuDog } from "react-icons/lu";

const backgroundColors = [
	"#ECECEC",
	"#C4DEF0",
	"#CCE3AB",
	"#FFE5AC",
	"#FFB4B4",
	"#E2C8ED",
];
const characterIcons = [
	{
		id: "MdOutlineTagFaces",
		icon: <MdOutlineTagFaces size="70%" color="#5B5B5B" />,
	},
	{
		id: "MdOutlineFace4",
		icon: <MdOutlineFace4 size="70%" color="#5B5B5B" />,
	},
	{ 
    id: "BiFace",
    icon: <BiFace size="70%" color="#5B5B5B" /> 
  },
	{ 
    id: "TbSunglasses", 
    icon: <TbSunglasses size="70%" color="#5B5B5B" /> 
  },
	{ 
    id: "LuCat", 
    icon: <LuCat size="70%" color="#5B5B5B" /> 
  },
	{ 
    id: "LuDog", 
    icon: <LuDog size="70%" color="#5B5B5B" /> },
];

export default function EditProfilePage() {
	const [nickname, setNickname] = useState("별명");
  const [selectedColor, setSelectedColor] = useState("#ECECEC");
	const [selectedIcon, setSelectedIcon] = useState("MdOutlineTagFaces");

	return (
		<div className="min-h-screen flex flex-col items-center">
			{/* 헤더 */}
			<div className="h-35 flex items-center justify-center">
				<h1
					className="text-4xl"
					style={{ fontFamily: "Paperlogy-8ExtraBold" }}
				>
					부글
				</h1>
			</div>

			<div className="flex flex-col items-center" style={{ fontFamily: "NanumSquare" }}>
				{/* 프로필 미리보기 */}
				<div
					className="w-18 h-18 rounded-full flex items-center justify-center mt-8 mb-12"
					style={{ backgroundColor: selectedColor }}
				>
					{characterIcons.find((c) => c.id === selectedIcon)?.icon}
				</div>

				<form>
					{/* 배경색 선택 */}
					<div className="flex items-center gap-6 mb-8">
						<label className="w-28 text-right text-[#A5A5A5] text-base">
							배경색
						</label>
						<div className="w-100 flex justify-between">
							{backgroundColors.map((color) => (
								<button
									key={color}
                  type="button"
									className={`w-14 h-14 rounded-full border-2 ${
										selectedColor === color
											? "border-[#A5A5A5]"
											: "border-transparent"
									}`}
									style={{ backgroundColor: color }}
									onClick={() => setSelectedColor(color)}
								/>
							))}
						</div>
						<div className="w-28" />
					</div>

					{/* 캐릭터 선택 */}
					<div className="flex items-center gap-6 mb-8">
						<label className="w-28 text-right text-[#A5A5A5] text-base">
							캐릭터
						</label>
						<div className="w-100 flex justify-between">
							{characterIcons.map((char) => (
								<button
									key={char.id}
                  type="button"
									className={`w-14 h-14 rounded-full border-2 flex items-center justify-center ${
										selectedIcon === char.id
											? "border-[#A5A5A5]"
											: "border-transparent"
									}`}
									onClick={() => setSelectedIcon(char.id)}
								>
									{char.icon}
								</button>
							))}
						</div>
					</div>

					{/* 별명 입력 */}
					<div className="flex items-center gap-6 mb-12">
						<label className="w-28 text-right text-[#A5A5A5] text-base">
							별명
						</label>
						<input
							type="text"
							value={nickname}
							onChange={(e) => setNickname(e.target.value)}
							className="w-100 h-15 border border-[#A5A5A5] rounded box-border px-4"
						/>
						<div className="w-28" />
					</div>

					{/* 버튼 */}
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
}
