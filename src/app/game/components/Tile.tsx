// app/game/components/Tile.tsx
'use client'

import React, { forwardRef } from 'react'

interface TileProps {
  letter: string
  selectCount: number
  invalid: boolean
  onTileMouseDown: () => void
  onTileMouseEnter: () => void
}

const Tile = forwardRef<HTMLButtonElement, TileProps>(
  ({ letter, selectCount, invalid, onTileMouseDown, onTileMouseEnter }, ref) => {
    const pointerClass = invalid ? 'pointer-events-none' : ''

    const blueBgClasses = [
      'bg-white',        // 0회 선택
      'bg-blue-100',     // 1회
      'bg-blue-200',     // 2회
      'bg-blue-300',     // 3회
      'bg-blue-400',     // 4회
      'bg-blue-500',     // 5회 이상
    ]
    const bgClass = blueBgClasses[Math.min(selectCount, blueBgClasses.length - 1)]


    const outlineClass = selectCount > 0 ? 'outline-2 outline-blue-400' : 'outline-1 outline-gray-300'

    return (
      <button
        ref={ref}
        type="button"
        onMouseDown={onTileMouseDown}
        onMouseEnter={onTileMouseEnter}
        disabled={invalid}
        className={`
          w-full aspect-square rounded flex items-center justify-center font-bold text-lg
          transition-all duration-300 select-none
          ${outlineClass}
          ${pointerClass}
          ${bgClass}
        `}
        // style={{ backgroundColor: bgColor }}
        onDragStart={e => e.preventDefault()}
      >
        {letter}
      </button>
    )
  }
)
export default Tile;