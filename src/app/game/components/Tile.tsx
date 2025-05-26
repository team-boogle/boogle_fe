// app/game/components/Tile.tsx
'use client'

import React, { forwardRef } from 'react'

interface TileProps {
  letter: string
  selected: boolean
  invalid: boolean
  onTileMouseDown: () => void
  onTileMouseEnter: () => void
}

const Tile = forwardRef<HTMLButtonElement, TileProps>(
  ({ letter, selected, invalid, onTileMouseDown, onTileMouseEnter }, ref) => {
    const pointerClass = invalid ? 'pointer-events-none' : ''
    return (
      <button
        ref={ref} // ref를 버튼에 연결
        type="button"
        onMouseDown={onTileMouseDown}
        onMouseEnter={onTileMouseEnter}
        disabled={invalid}
        className={`
          w-full aspect-square outline outline-1 outline-gray-300
          rounded flex items-center justify-center font-bold text-lg
          transition-all duration-300 select-none
          ${selected ? 'bg-blue-100 outline-2 outline-blue-400' : 'bg-white'}
          ${pointerClass}
        `}
        onDragStart={(e) => e.preventDefault()}
      >
        {letter}
      </button>
    )
  }
)

Tile.displayName = 'Tile' // 디버깅용 이름 지정

export default Tile
