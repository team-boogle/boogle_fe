// app/game/components/Board.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Tile from './Tile'

interface PositionWithLetter {
  row: number
  col: number
  letter: string
}

interface BoardViewProps {
  tiles: string[][]
  invalidTiles: Set<string>
  onSelectionEnd: (path: PositionWithLetter[]) => void
}

export default function BoardView({
  tiles,
  invalidTiles,
  onSelectionEnd,
}: BoardViewProps): React.JSX.Element {
  const [dragging, setDragging] = useState(false)
  const [path, setPath] = useState<PositionWithLetter[]>([])

  // 마우스 업 이벤트 핸들러
  useEffect(() => {
    const handleMouseUp = () => {
      if (dragging) {
        setDragging(false)
        onSelectionEnd(path)
        setPath([])
      }
    }
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [dragging, path, onSelectionEnd])

  // 타일 선택 로직
  const selectTile = (row: number, col: number) => {
    const key = `${row},${col}`
    if (invalidTiles.has(key)) return

    // 인접성 검사
    if (path.length > 0) {
      const last = path[path.length - 1]
      const dr = Math.abs(row - last.row)
      const dc = Math.abs(col - last.col)
      if (dr > 1 || dc > 1) return
    }

    // 경로 추가
    if (!path.some(t => t.row === row && t.col === col)) {
      setPath(prev => [...prev, { row, col, letter: tiles[row][col] }])
    }
  }

  return (
    <div
      className="w-full h-full grid gap-1 rounded-lg"
      style={{ gridTemplateColumns: `repeat(${tiles.length}, 1fr)` }}
      onMouseDown={() => setDragging(true)}
    >
      {tiles.map((row, i) =>
        row.map((cell, j) => (
          <Tile
            key={`${i}-${j}`}
            letter={cell}
            selected={path.some(t => t.row === i && t.col === j)}
            invalid={invalidTiles.has(`${i},${j}`)}
            onTileMouseDown={() => selectTile(i, j)}
            onTileMouseEnter={() => dragging && selectTile(i, j)}
          />
        ))
      )}
    </div>
  )
}
