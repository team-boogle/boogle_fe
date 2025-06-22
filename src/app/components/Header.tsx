"use client";

import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

	return (
		<div className="h-35 flex items-center justify-center">
			<h1
				className="text-4xl"
				style={{
					cursor: "pointer",
					fontFamily: "Paperlogy-8ExtraBold",
				}}
				onClick={() => router.push("/")}
			>
				부글
			</h1>
		</div>
	);
};

export default Header;