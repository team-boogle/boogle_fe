const MyPage = () => {
  const user = {
		id: "userid01",
		nickname: "닉네임",
		bestScore: 0,
  };

  return (
		<div className="min-h-screen flex flex-col items-center">
			<div className="h-35 flex items-center justify-center">
				<h1 className="text-4xl" style={{ fontFamily: "Paperlogy-8ExtraBold" }}>부글</h1>
			</div>
			<div className="flex flex-col items-center mt-15">
				<div className="w-25 h-25 rounded-full bg-[#ECECEC]" />
				<div className="space-y-11 my-12">
					<div className="flex justify-center gap-8">
						<span className="w-20 text-right text-[#A5A5A5]">
							아이디
						</span>
						<span className="w-55">{user.id}</span>
					</div>
					<div className="flex justify-center gap-8">
						<span className="w-20 text-right text-[#A5A5A5]">
							별명
						</span>
						<span className="w-55">{user.nickname}</span>
					</div>
					<div className="flex justify-center gap-8">
						<span className="w-20 text-right text-[#A5A5A5]">
							최고기록
						</span>
						<span className="w-55">{user.bestScore}점</span>
					</div>
				</div>

				<div className="text-[#A5A5A5] space-x-4 mt-5">
					<button className="hover:underline">프로필 수정</button>
					<span>|</span>
					<button className="hover:underline">비밀번호 변경</button>
					<span>|</span>
					<button className="hover:underline">로그아웃</button>
				</div>
			</div>
		</div>
  );
};

export default MyPage;
