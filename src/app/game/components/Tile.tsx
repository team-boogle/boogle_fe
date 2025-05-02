// app/game/components/Tile.tsx
'use client'

import React from 'react'

interface TileProps {
  letter: string
  selected: boolean
  invalid: boolean
  onTileMouseDown(): void
  onTileMouseEnter(): void
}

export default function Tile({
  letter,
  selected,
  invalid,
  onTileMouseDown,
  onTileMouseEnter,
}: TileProps): React.JSX.Element {
  const pointerClass = invalid ? 'pointer-events-none' : ''
  return (
    <button
      type="button"
      onMouseDown={onTileMouseDown}
      onMouseEnter={onTileMouseEnter}
      disabled={invalid}
      className={`
        w-full aspect-square border border-gray-300 rounded flex items-center justify-center font-bold text-lg select-none
        transition
        ${selected ? 'bg-red-400' : 'bg-white'}
        ${pointerClass}
      `}
      onDragStart={(e) => e.preventDefault()}
    >
      {letter}
    </button>
  )
}

