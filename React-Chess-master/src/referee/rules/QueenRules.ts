import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";
import {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "./GeneralRules";

const QUEEN_DIRECTIONS = [
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

const isStraightOrDiagonal = (
  from: Position,
  to: Position
): boolean =>
  from.x === to.x || from.y === to.y ||
  Math.abs(to.x - from.x) === Math.abs(to.y - from.y);

const isPathClear = (
  from: Position,
  to: Position,
  boardState: Piece[]
): boolean => {
  const stepX = Math.sign(to.x - from.x);
  const stepY = Math.sign(to.y - from.y);

  let current = new Position(from.x + stepX, from.y + stepY);

  while (!current.samePosition(to)) {
    if (tileIsOccupied(current, boardState)) {
      return false;
    }
    current = new Position(current.x + stepX, current.y + stepY);
  }

  return true;
};

export const queenMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  if (!isWithinBoard(desiredPosition)) {
    return false;
  }

  if (!isStraightOrDiagonal(initialPosition, desiredPosition)) {
    return false;
  }

  if (!isPathClear(initialPosition, desiredPosition, boardState)) {
    return false;
  }

  return tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team);
};

export const getPossibleQueenMoves = (
  queen: Piece,
  boardstate: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  for (const direction of QUEEN_DIRECTIONS) {
    let destination = new Position(
      queen.position.x + direction.x,
      queen.position.y + direction.y
    );

    while (isWithinBoard(destination)) {
      if (!tileIsOccupied(destination, boardstate)) {
        possibleMoves.push(destination.clone());
      } else if (tileIsOccupiedByOpponent(destination, boardstate, queen.team)) {
        possibleMoves.push(destination.clone());
        break;
      } else {
        break;
      }

      destination = new Position(
        destination.x + direction.x,
        destination.y + direction.y
      );
    }
  }

  return possibleMoves;
};