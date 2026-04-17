import { useEffect, useRef, useState } from "react";
import "./Chessboard.css";
import Tile from "../Tile/Tile";
import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
  GRID_SIZE,
} from "../../Constants";
import { Piece, Position } from "../../models";

interface Props {
  playMove: (piece: Piece, position: Position) => boolean;
  pieces: Piece[];
}

export default function Chessboard({playMove, pieces} : Props) {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position>(new Position(-1, -1));
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const chessboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWindowMouseUp = () => {
      if (activePiece) {
        resetActivePiece();
      }
    };

    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => window.removeEventListener("mouseup", handleWindowMouseUp);
  }, [activePiece]);

  function resetActivePiece() {
    if (activePiece) {
      activePiece.style.position = "relative";
      activePiece.style.removeProperty("top");
      activePiece.style.removeProperty("left");
      setActivePiece(null);
    }
  }

  function grabPiece(e: React.MouseEvent) {
    if (e.button !== 0) {
      return;
    }

    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );
      setGrabPosition(new Position(grabX, grabY));

      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      setActivePiece(element);
    }
  }

  function getBoardPosition(e: React.MouseEvent): Position | null {
    const chessboard = chessboardRef.current;
    if (!chessboard) return null;

    const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
    const y = Math.abs(
      Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
    );

    if (x < 0 || x > 7 || y < 0 || y > 7) return null;
    return new Position(x, y);
  }

  function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 25;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activePiece.style.position = "absolute";

      if (x < minX) {
        activePiece.style.left = `${minX}px`;
      } else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;
      } else {
        activePiece.style.left = `${x}px`;
      }

      if (y < minY) {
        activePiece.style.top = `${minY}px`;
      } else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;
      } else {
        activePiece.style.top = `${y}px`;
      }
    }
  }

  function handleBoardClick(e: React.MouseEvent) {
    const clickPosition = getBoardPosition(e);
    if (!clickPosition) {
      setSelectedPosition(null);
      return;
    }

    const currentPiece = pieces.find((p) => p.samePosition(clickPosition));
    const selectedPiece = selectedPosition
      ? pieces.find((p) => p.samePosition(selectedPosition))
      : undefined;

    if (
      selectedPiece?.possibleMoves?.some((move) =>
        move.samePosition(clickPosition)
      )
    ) {
      const didMove = playMove(selectedPiece.clone(), clickPosition);
      if (didMove) {
        setSelectedPosition(null);
      }
      return;
    }

    if (currentPiece) {
      setSelectedPosition(new Position(clickPosition.x, clickPosition.y));
      return;
    }

    setSelectedPosition(null);
  }

  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
      );

      const currentPiece = pieces.find((p) =>
        p.samePosition(grabPosition)
      );

      if (currentPiece) {
        const success = playMove(currentPiece.clone(), new Position(x, y));

        if (!success) {
          resetActivePiece();
          return;
        }
      }

      setActivePiece(null);
    }
  }

  let board = [];

  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const number = j + i + 2;
      const piece = pieces.find((p) =>
        p.samePosition(new Position(i, j))
      );
      let image = piece ? piece.image : undefined;

      let currentPiece = selectedPosition
        ? pieces.find((p) => p.samePosition(selectedPosition))
        : activePiece != null
        ? pieces.find((p) => p.samePosition(grabPosition))
        : undefined;
      let highlight = currentPiece?.possibleMoves
        ? currentPiece.possibleMoves.some((p) => p.samePosition(new Position(i, j)))
        : false;

      board.push(<Tile key={`${j},${i}`} image={image} number={number} highlight={highlight} />);
    }
  }

  return (
    <>
      <div
        onMouseMove={(e) => movePiece(e)}
        onMouseDown={(e) => grabPiece(e)}
        onMouseUp={(e) => dropPiece(e)}
        onClick={(e) => handleBoardClick(e)}
        onContextMenu={(e) => {
          if (activePiece) {
            resetActivePiece();
          }
          setSelectedPosition(null);
          e.preventDefault();
        }}
        id="chessboard"
        ref={chessboardRef}
      >
        {board}
      </div>
    </>
  );
}
