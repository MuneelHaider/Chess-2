import { Position } from "../models/Position";
import { PieceType } from "../Types";
import { Piece } from "../models/Piece";

/**
 * Convert a board position (0-7, 0-7) to algebraic notation (a1-h8)
 * Position (0,0) = a1 (white's bottom-left)
 * Position (7,7) = h8 (black's top-right)
 */
export function positionToAlgebraic(position: Position): string {
  const file = String.fromCharCode(97 + position.x); // 'a' to 'h'
  const rank = (8 - position.y).toString(); // '8' to '1'
  return `${file}${rank}`;
}

/**
 * Get the piece symbol for algebraic notation
 */
function getPieceSymbol(pieceType: PieceType): string {
  switch (pieceType) {
    case PieceType.PAWN:
      return "";
    case PieceType.KNIGHT:
      return "N";
    case PieceType.BISHOP:
      return "B";
    case PieceType.ROOK:
      return "R";
    case PieceType.QUEEN:
      return "Q";
    case PieceType.KING:
      return "K";
    default:
      return "";
  }
}

/**
 * Convert a move to algebraic notation
 * @param piece The piece being moved
 * @param from Starting position
 * @param to Destination position
 * @param capturedPiece Optional piece that was captured
 * @param isPromotion Whether this is a pawn promotion
 * @param promotionType The piece type for promotion (if applicable)
 * @param isCastling Whether this is a castling move
 * @returns The move in algebraic notation (e.g., "e4", "Nf3", "exd5")
 */
export function moveToAlgebraicNotation(
  piece: Piece,
  from: Position,
  to: Position,
  capturedPiece: Piece | undefined,
  isPromotion: boolean = false,
  promotionType: PieceType | undefined = undefined,
  isCastling: boolean = false
): string {
  // Castling
  if (isCastling) {
    // Kingside castling (king moves to g-file)
    if (to.x > from.x) {
      return "O-O";
    }
    // Queenside castling (king moves to c-file)
    return "O-O-O";
  }

  const fromNotation = positionToAlgebraic(from);
  const toNotation = positionToAlgebraic(to);
  const pieceSymbol = getPieceSymbol(piece.type);
  const isCapture = capturedPiece !== undefined;

  let notation = "";

  if (piece.type === PieceType.PAWN) {
    // Pawn moves
    if (isCapture) {
      // Pawn capture: file of origin + x + destination (e.g., "exd5")
      notation = fromNotation[0] + "x" + toNotation;
    } else {
      // Pawn push: just destination (e.g., "e4")
      notation = toNotation;
    }
  } else {
    // Other pieces
    notation = pieceSymbol;

    if (isCapture) {
      notation += "x";
    }

    notation += toNotation;
  }

  // Promotion (e.g., "e8=Q")
  if (isPromotion && promotionType) {
    notation += "=" + getPieceSymbol(promotionType);
  }

  return notation;
}

/**
 * Format move history for display - pairs moves by half-move number
 * e.g., ["e4", "c5", "Nf3", "d6"] becomes [["1.", "e4", "c5"], ["2.", "Nf3", "d6"], ...]
 */
export function formatMoveHistory(moves: string[]): Array<[string, string, string]> {
  const formatted: Array<[string, string, string]> = [];

  for (let i = 0; i < moves.length; i += 2) {
    const moveNumber = Math.floor(i / 2) + 1;
    const whiteMove = moves[i] || "";
    const blackMove = moves[i + 1] || "";

    formatted.push([`${moveNumber}.`, whiteMove, blackMove]);
  }

  return formatted;
}
