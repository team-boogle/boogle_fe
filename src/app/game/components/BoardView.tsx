'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  onPathChange?: (path: PositionWithLetter[]) => void
}

export default function BoardView({
  tiles,
  invalidTiles,
  onSelectionEnd,
  onPathChange
}: BoardViewProps): React.JSX.Element {
  const [dragging, setDragging] = useState(false)
  const [path, setPath] = useState<PositionWithLetter[]>([])
  const boardRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<(HTMLButtonElement | null)[][]>([]);

  // 타일 ref 초기화
  useEffect(() => {
  // 보드 크기에 맞게 2차원 배열 초기화
  tileRefs.current = Array(tiles.length)
    .fill(null)
    .map((_, i) => 
      Array(tiles[i].length).fill(null)
    );
  }, [tiles]);

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

  useEffect(() => {
  onPathChange?.(path)
  }, [path, onPathChange])

  // 타일 선택 로직
  const selectTile = (row: number, col: number) => {
    const key = `${row},${col}`
    if (invalidTiles.has(key)) return

    if (path.length > 0) {
      const last = path[path.length - 1]
      const dr = Math.abs(row - last.row)
      const dc = Math.abs(col - last.col)
      if (dr > 1 || dc > 1) return
    }
    setPath(prev => [...prev, { row, col, letter: tiles[row][col] }])
  }
  // 중복 카운트
  const getTileSelectCount = (row: number, col: number) => path.filter(t => t.row === row && t.col === col).length;
  
  // SVG 연결선 좌표 계산
  const getLinePoints = () => {
  if (!boardRef.current || path.length < 2) return '';
  const boardRect = boardRef.current.getBoundingClientRect();
  
  return path.map(({ row, col }) => {
    const tile = tileRefs.current[row]?.[col]; // 옵셔널 체이닝
    if (!tile) return '';
    const rect = tile.getBoundingClientRect();
    const x = rect.left + rect.width/2 - boardRect.left;
    const y = rect.top + rect.height/2 - boardRect.top;
    return `${x},${y}`;
  }).join(' ');
};

  return (
    // 이 컨테이너가 중앙 정렬을 담당합니다.
    <div className="w-full h-full grid">
      {/* 
        보드와 SVG를 함께 감싸는 컨테이너입니다.
        이 컨테이너가 정사각형 비율을 가지며, SVG와 보드는 이 컨테이너를 꽉 채웁니다.
      */}
      <div
        className="relative w-full max-w-full aspect-square"
        onMouseDown={() => setDragging(true)}
      >
        <div
          ref={boardRef}
          className="grid gap-2 rounded-lg w-full h-full" // aspect-square를 부모로 옮기고 w-full, h-full로 채웁니다.
          style={{
            gridTemplateColumns: `repeat(${tiles.length}, 1fr)`,
            gridTemplateRows: `repeat(${tiles.length}, 1fr)`,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {tiles.map((row, i) =>
            row.map((cell, j) => (
              <Tile
                key={`${i}-${j}`}
                ref={(el) => {
                  if (!tileRefs.current[i]) tileRefs.current[i] = [];
                  tileRefs.current[i][j] = el;
                }}
                letter={cell}
                selectCount={getTileSelectCount(i, j)}
                invalid={invalidTiles.has(`${i},${j}`)}
                onTileMouseDown={() => selectTile(i, j)}
                onTileMouseEnter={() => dragging && selectTile(i, j)}
              />
            ))
          )}
        </div>

        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <polyline
            points={getLinePoints()}
            stroke="rgba(128, 128, 128, 1)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
