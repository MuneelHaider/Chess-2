import { Piece, Position } from "../../models";
import { TeamType } from "../../Types";
import { tileIsEmptyOrOccupiedByOpponent } from "./GeneralRules";

const KNIGHT_OFFSETS = [
  { x: 1, y: 2 },
  { x: 1, y: -2 },
  { x: -1, y: 2 },
  { x: -1, y: -2 },
  { x: 2, y: 1 },
  { x: 2, y: -1 },
  { x: -2, y: 1 },
  { x: -2, y: -1 },
];

const isWithinBoard = (position: Position): boolean =>
  position.x >= 0 && position.x <= 7 && position.y >= 0 && position.y <= 7;

export const knightMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  if (!isWithinBoard(desiredPosition)) {
    return false;
  }

  const dx = desiredPosition.x - initialPosition.x;
  const dy = desiredPosition.y - initialPosition.y;

  const isKnightMove = KNIGHT_OFFSETS.some(
    (offset) => offset.x === dx && offset.y === dy
  );

  return (
    isKnightMove &&
    tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)
  );
};

export const getPossibleKnightMoves = (
  knight: Piece,
  boardstate: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  for (const offset of KNIGHT_OFFSETS) {
    const destination = new Position(
      knight.position.x + offset.x,
      knight.position.y + offset.y
    );

    if (!isWithinBoard(destination)) {
      continue;
    }

    if (
      tileIsEmptyOrOccupiedByOpponent(destination, boardstate, knight.team)
    ) {
      possibleMoves.push(destination);
    }
  }

  return possibleMoves;
};