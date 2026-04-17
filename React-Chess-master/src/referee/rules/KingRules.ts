import { Piece, Position } from "../../models";
import { TeamType } from "../../Types";
import {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "./GeneralRules";

const KING_DIRECTIONS = [
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 1, y: 1 },
  { x: 1, y: -1 },
  { x: -1, y: -1 },
  { x: -1, y: 1 },
];

const isWithinBoard = (position: Position): boolean =>
  position.x >= 0 && position.x <= 7 && position.y >= 0 && position.y <= 7;

export const kingMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  const dx = desiredPosition.x - initialPosition.x;
  const dy = desiredPosition.y - initialPosition.y;

  if (Math.max(Math.abs(dx), Math.abs(dy)) !== 1) {
    return false;
  }

  if (!isWithinBoard(desiredPosition)) {
    return false;
  }

  return tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team);
};

export const getPossibleKingMoves = (
  king: Piece,
  boardstate: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  for (const direction of KING_DIRECTIONS) {
    const destination = new Position(
      king.position.x + direction.x,
      king.position.y + direction.y
    );

    if (!isWithinBoard(destination)) {
      continue;
    }

    if (!tileIsOccupied(destination, boardstate)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardstate, king.team)) {
      possibleMoves.push(destination);
    }
  }

  return possibleMoves;
};

// In this method the enemy moves have already been calculated
export const getCastlingMoves = (king: Piece, boardstate: Piece[]): Position[] => {
  const possibleMoves: Position[] = [];

  if (king.hasMoved) return possibleMoves;

  // We get the rooks from the king's team which haven't moved
  const rooks = boardstate.filter(p => p.isRook
    && p.team === king.team && !p.hasMoved);

  // Loop through the rooks
  for (const rook of rooks) {
    // Determine if we need to go to the right or the left side
    const direction = (rook.position.x - king.position.x > 0) ? 1 : -1;

    const adjacentPosition = king.position.clone();
    adjacentPosition.x += direction;

    if(!rook.possibleMoves?.some(m => m.samePosition(adjacentPosition))) continue;

    // We know that the rook can move to the adjacent side of the king

    const conceringTiles = rook.possibleMoves.filter(m => m.y === king.position.y);

    // Checking if any of the enemy pieces can attack the spaces between
    // The rook and the king
    const enemyPieces = boardstate.filter(p => p.team !== king.team);

    let valid = true;

    for(const enemy of enemyPieces) {
      if(enemy.possibleMoves === undefined) continue;

      for(const move of enemy.possibleMoves) {
        if(conceringTiles.some(t => t.samePosition(move))) {
          valid = false;
        }

        if(!valid)
          break;
      }

      if(!valid)
        break;
    }

    if(!valid) continue;

    // We now want to add it as a possible move!
    possibleMoves.push(rook.position.clone());
  }

  return possibleMoves;
}