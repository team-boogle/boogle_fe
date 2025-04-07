"use client";

import React, { useEffect, useState } from "react";

const TWO_MINUTES = 2 * 60;

const CountdownTimer: React.FC = () => {
	const [secondsLeft, setSecondsLeft] = useState(TWO_MINUTES);
	const [hasStarted, setHasStarted] = useState(false);

	useEffect(() => {
		if (!hasStarted || secondsLeft <= 0) return;

		const timer = setInterval(() => {
			setSecondsLeft((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [hasStarted, secondsLeft]);

	const exit = () => {
		setSecondsLeft(TWO_MINUTES);
		setHasStarted(false);
	};

	const formatTime = (seconds: number): string => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m.toString().padStart(2, "0")}:${s
			.toString()
			.padStart(2, "0")}`;
	};

	const startTimer = () => {
		setHasStarted(true);
		setSecondsLeft(TWO_MINUTES);
	};

	return (
		<div className="flex flex-col items-center gap-4">
			{!hasStarted ? (
				<button
					onClick={startTimer}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
				>
					Start
				</button>
			) : (
				<>
					<h1 className="text-4xl font-bold">
						{(secondsLeft > 0) ? formatTime(secondsLeft) : "Game Over!"}
					</h1>
					<button
						onClick={exit}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
					>
						Exit
					</button>
				</>
			)}
		</div>
	);
};

export default CountdownTimer;
