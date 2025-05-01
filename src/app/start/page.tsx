"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import styles from "./page.module.css"
import { motion, useAnimate, useMotionValue, useVelocity, MotionValue } from "motion/react"

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
    const [firstLoad, setFirstLoad] = useState(true)
    const [modalOpened, setModalOpened] = useState(false)

    const [scope, animate] = useAnimate()

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const mouseVelocityX = useVelocity(mouseX)
    const mouseVelocityY = useVelocity(mouseY)

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
            <motion.div ref={scope} className="w-screen h-[calc(100vh + 2px)] bg-black/95 relative border-t-2">
                <div className="absolute top-0 right-0 cursor-pointer py-4 px-4 text-xl font-light"
                onClick={handleCloseClick}><Image src={"/close.png"} alt="close" height={18} width={18}></Image></div>
                <div className="flex h-screen w-screen justify-center items-center">
                    <div className="flex flex-row ">
                        <div className="flex justify-center items-center">
                            <div>
                                <motion.input type="text" placeholder="아이디"
                                    className="py-2 px-4 bg-transparent border-1 border-white/50 focus:border-white w-[300px] block rounded-lg mb-3"
                                    whileFocus={{ scale: 1.1 }}></motion.input>
                                <motion.input type="password" placeholder="비밀번호"
                                    className="py-2 px-4 bg-transparent border-1 border-white/50 focus:border-white w-[300px] block rounded-lg mb-3"
                                    whileFocus={{ scale: 1.1 }}></motion.input>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="text-lg py-2 px-5 rounded-lg cursor-pointer bg-blue-500 w-[300px] mt-1">로그인</motion.button>
                            </div>
                            <div className="font-light text-2xl mx-12">
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
