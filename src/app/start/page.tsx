"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import styles from "./page.module.css"
import { motion, useAnimate, useMotionValue, useVelocity, MotionValue } from "motion/react"
import Link from 'next/link';
import { useRouter } from "next/navigation" // 라우터 훅 추가
import { useUserStore } from "../stores/userStore" // 사용자 스토어 훅 추가

import { User, AvatarIconName } from "../stores/userStore"; // User와 AvatarIconName 타입을 가져옵니다.

// 테스트용 더미 유저를 생성하는 함수
const createDummyUser = (username: string): User => {
  return {
    // 사용자가 입력한 아이디를 사용하되, 입력값이 없으면 '개발자'로 기본 설정
    username: username || '개발자', 
    highScore: 7777, // 최고 점수는 임의의 값으로 설정
    // 첨부해주신 이미지의 '고양이' 아이콘과 색상을 사용
    avatar: 'LuCat', 
    avatarColor: '#FFB4B4',
  };
};
const APIurl = process.env.NEXT_PUBLIC_API_URL;


const COLLISION_RANGE = 10
const CharWithCollison = (props: {
    mouseX: MotionValue<number>,
    mouseY: MotionValue<number>,
    mouseVelocityX: MotionValue<number>,
    mouseVelocityY: MotionValue<number>,
    initialX?: number,
    initialY?: number,
    scaleX?: number,
    scaleY?: number,
    children: string
    clipPath?: string
}) => {
    const x = useMotionValue(props.initialX ?? 0)
    const y = useMotionValue(props.initialY ?? 0)
    const [scope, animate] = useAnimate()
    const [isMoving, setIsMoving] = useState(false)

    useEffect(() => {
        const checkCollision = () => {
            const element = scope.current

            if (!element || isMoving) return
            
            const mx = props.mouseX.get()
            const my = props.mouseY.get()

            const rect = element.getBoundingClientRect()

            const collidingWithCursor = rect.left - COLLISION_RANGE < mx && mx < rect.right + COLLISION_RANGE 
                                    && rect.top - COLLISION_RANGE < my && my < rect.bottom + COLLISION_RANGE

            if (collidingWithCursor) {
                const vx = props.mouseVelocityX.get()
                const vy = props.mouseVelocityY.get()

                const xFactor = Math.min(Math.abs(vx), 1000) / 10
                const yFactor = Math.min(Math.abs(vy), 1000) / 10

                setIsMoving(true)
                animate(element, {
                    x: x.get() + (Math.sign(vx) * xFactor)
                }, {
                    type: "spring",
                    velocity: vx / 5,
                    damping: 50,
                    stiffness: 200
                    
                })
                animate(element, {
                    y: y.get() + (Math.sign(vy) * yFactor)
                }, {
                    type: "spring",
                    velocity: vy / 5,
                    damping: 50,
                    stiffness: 200
                })
                setTimeout(() => setIsMoving(false), 3000)
            }
        }

        let rafId: number
        const update = () => {
            checkCollision()
            rafId = requestAnimationFrame(update)
        }

        update()
        return () => cancelAnimationFrame(rafId)
    }, [])

    return (
        <motion.span className="inline-block"
            style={{ clipPath: props.clipPath ?? 'none' }} ref={scope}
            initial={{ x: props.initialX, y: props.initialY, scaleX: props.scaleX ?? 1.0, scaleY: props.scaleY ?? 1.0 }}>
            {props.children}
        </motion.span>
    )
}



export default function StartPage() {

    const router = useRouter();
    const { user, setUser } = useUserStore(); // 스토어에서 user 정보와 setUser 함수 가져오기
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [firstLoad, setFirstLoad] = useState(true)
    const [modalOpened, setModalOpened] = useState(false)

    const [scope, animate] = useAnimate()

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const mouseVelocityX = useVelocity(mouseX)
    const mouseVelocityY = useVelocity(mouseY)


    useEffect(() => {
        // user 객체가 존재하면 (로그인 상태이면) /game 페이지로 이동시킵니다.
        if (user) {
            router.replace('/game'); // replace를 사용해 뒤로가기 시 시작 페이지로 돌아오지 않도록 함 [4]
        }
    }, [user, router]);


    // StartPage 컴포넌트 내부

const handleLogin = async () => {
    // 입력값 유효성 검사 (기존과 동일)
    if (!email || !password) {
        alert("아이디와 비밀번호를 입력해주세요.");
        return;
    }

    try {
        console.log("📧 email:", email, "🔑 password:", password);
        const response = await fetch(`${APIurl}/api/sign_in`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: email,
                password: password,
            }),
            credentials: "include"
        });

        if (response.ok) {
            const apiResponse = await response.json();
            console.log("✅ 로그인 성공! 서버 원본 데이터:", apiResponse);

            const mappedUser: User = {
                username: apiResponse.username,
                nickname: apiResponse.nickname,
                highScore: apiResponse.highScore,
                avatarColor: apiResponse.bg_color || '#ECECEC', 
                avatar: apiResponse.profile_image as AvatarIconName | null,
            };
            setUser(mappedUser);
            router.push('/game');
        } else {
            const errorData = await response.json();
            console.warn(`⚠️ 서버 응답 실패: ${errorData.message || response.statusText}.`);
            
            alert('로그인 실패')
        }

    } catch (error) {
        console.error("❌ 네트워크 오류 발생.", error);
        alert('로그인 실패')
        // // 더미 데이터로 로그인 처리
        // const dummyUser = createDummyUser(email);
        // setUser(dummyUser);
        router.push('/')
    }
};




    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (modalOpened) return
            mouseX.set(e.clientX)
            mouseY.set(e.clientY)
        }
        
        document.addEventListener("mousemove", handleMouseMove)

        const timer = setTimeout(() => setFirstLoad(false), 1000)
        return () => {
            document.removeEventListener("mousemove", handleMouseMove)
            clearTimeout(timer)
        }
    }, [modalOpened])

    const buttonVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: (firstLoad: boolean) => ({ scale: 1, opacity: 1, transition: { delay: firstLoad ? 0.5 : 0, type: "spring", duration: 0.5 } }),
        hover: { scale: 1.1 },
        tap: { scale: 0.95 }
    }

    const handleButtonClick = () => {
        setModalOpened(true)
        animate(scope.current, {
            y: "calc(-100vh - 2px)"
        }, {
            duration: 0.3
        })
    }

    const handleCloseClick = () => {
        setModalOpened(false)
        animate(scope.current, {
            y: 0
        }, {
            duration: 0.3
        })
    }

    return (
        <div className="w-screen h-screen overflow-hidden" id={styles.startpage}>
            <div className="w-screen h-screen flex justify-center items-center">
                <div className="h-fit">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring", duration: 0.6 }}
                        className="font-extrabold">
                            <h1 className="text-9xl h-[115px] -translate-y-[230px]">
                                <span className="inline-block w-[115px] h-[115px]">
                                    <CharWithCollison mouseX={mouseX} mouseY={mouseY}
                                        mouseVelocityX={mouseVelocityX} mouseVelocityY={mouseVelocityY}
                                        initialY={97} scaleX={1.2} scaleY={0.9}>ㅂ</CharWithCollison>
                                    <CharWithCollison mouseX={mouseX} mouseY={mouseY}
                                        mouseVelocityX={mouseVelocityX} mouseVelocityY={mouseVelocityY}
                                        initialY={30} clipPath="inset(0 0 30% 0)">ㅜ</CharWithCollison>
                                </span>
                                <span className="inline-block w-[115px] h-[115px]">
                                    <CharWithCollison mouseX={mouseX} mouseY={mouseY}
                                        mouseVelocityX={mouseVelocityX} mouseVelocityY={mouseVelocityY}
                                        initialY={225} scaleX={1.2} scaleY={0.9} clipPath="inset(0 0 45% 0)">ㄱ</CharWithCollison>
                                    <CharWithCollison mouseX={mouseX} mouseY={mouseY}
                                        mouseVelocityX={mouseVelocityX} mouseVelocityY={mouseVelocityY}
                                        initialY={115} scaleY={0.85}>ㅡ</CharWithCollison>
                                    <CharWithCollison mouseX={mouseX} mouseY={mouseY}
                                        mouseVelocityX={mouseVelocityX} mouseVelocityY={mouseVelocityY}
                                        initialY={27} scaleX={1.2} scaleY={0.75}>ㄹ</CharWithCollison>
                                </span>
                                
                            </h1>
                            <div className="text-3xl text-center">
                                <CharWithCollison mouseX={mouseX} mouseY={mouseY}
                                    mouseVelocityX={mouseVelocityX} mouseVelocityY={mouseVelocityY}
                                    initialY={35}>한글 단어 조합 게임</CharWithCollison>
                            </div>
                    </motion.div>
                    <div className="flex justify-center">
                        <motion.button
                            custom={firstLoad}
                            variants={buttonVariants}
                            initial="initial" animate="animate"
                            whileHover="hover" whileTap="tap"
                            className="px-6 py-2 text-2xl border-1 rounded-lg cursor-pointer mt-16 mx-auto font-extralight"
                            onClick={handleButtonClick}>게임 시작</motion.button>
                    </div>
                </div>
            </div>
            <motion.div ref={scope} className="w-screen h-[calc(100vh + 2px)] bg-white/95 dark:bg-black/95 relative border-t-2">
                <div className="absolute top-0 right-0 cursor-pointer py-4 px-4 text-xl font-light"
                onClick={handleCloseClick}><Image src={"/close.png"} alt="close" height={18} width={18} className="dark:invert"></Image></div>
                <div className="flex h-screen w-screen justify-center items-center">
                    <div className="flex flex-row ">
                        <div className="flex justify-center items-center">
                            <div>
                                {/* --- 8. 입력 필드와 로그인 버튼에 상태와 핸들러 연결 --- */}
                                <motion.input type="text" placeholder="아이디"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="py-2 px-4 bg-transparent border-1 border-black/50 placeholder-black/50 dark:border-white/50 dark:placeholder-white/50 focus:border-white w-[300px] block rounded-lg mb-3"
                                    whileFocus={{ scale: 1.1 }}></motion.input>
                                <motion.input type="password" placeholder="비밀번호"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="py-2 px-4 bg-transparent border-1 border-black/50 placeholder-black/50 dark:border-white/50 dark:placeholder-white/50 focus:border-white w-[300px] block rounded-lg mb-3"
                                    whileFocus={{ scale: 1.1 }}></motion.input>
                                <motion.button
                                    onClick={handleLogin}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="text-lg py-2 px-5 rounded-lg cursor-pointer bg-blue-500 w-[300px] mt-1 text-white">로그인</motion.button>
                                 <Link href="/signup">
                                    <div className="font-extralight text-gray-400 hover:underline hover:decoration-gray-400 cursor-pointer mt-2 ml-1">
                                        회원가입하기
                                    </div>
                                </Link>
                            </div>
                            <div className="font-light text-2xl mx-12 dark:text-white">
                            또는
                            </div>
                            <div className="flex justify-center items-center">
                                <div><motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="text-xl py-3 px-6 border-2 rounded-xl cursor-pointer border-gray-400 text-gray-400 hover:text-white hover:bg-gray-600 hover:border-gray-600">로그인 없이 시작하기</motion.button></div>
                            </div>
                        </div>  
                    </div>
                </div>
            </motion.div>
        </div>
    );
}