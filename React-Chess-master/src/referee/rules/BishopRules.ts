import { Piece, Position } from "../../models";
import { TeamType } from "../../Types";
import {
  tileIsEmptyOrOccupiedByOpponent,
  tileIsOccupied,
  tileIsOccupiedByOpponent,
} from "./GeneralRules";

const BISHOP_DIRECTIONS = [
  { x: 1, y: 1 },
  { x: 1, y: -1 },
  { x: -1, y: -1 },
  { x: -1, y: 1 },
];

const isWithinBoard = (position: Position): boolean =>
  position.x >= 0 && position.x <= 7 && position.y >= 0 && position.y <= 7;

const isSameDiagonal = (from: Position, to: Position): boolean =>
  Math.abs(to.x - from.x) === Math.abs(to.y - from.y);

const getPathToDestination = (from: Position, to: Position): Position[] => {
  const path: Position[] = [];
  const stepX = Math.sign(to.x - from.x);
  const stepY = Math.sign(to.y - from.y);

  let current = new Position(from.x + stepX, from.y + stepY);
  while (!current.samePosition(to)) {
    path.push(current.clone());
    current = new Position(current.x + stepX, current.y + stepY);
  }

  return path;
};

export const bishopMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  if (!isSameDiagonal(initialPosition, desiredPosition)) {
    return false;
  }

  if (!isWithinBoard(desiredPosition)) {
    return false;
  }

  for (const position of getPathToDestination(initialPosition, desiredPosition)) {
    if (tileIsOccupied(position, boardState)) {
      return false;
    }
  }

  return tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team);
};

export const getPossibleBishopMoves = (
  bishop: Piece,
  boardstate: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];

  for (const direction of BISHOP_DIRECTIONS) {
    let destination = new Position(
      bishop.position.x + direction.x,
      bishop.position.y + direction.y
    );

    while (isWithinBoard(destination)) {
      if (!tileIsOccupied(destination, boardstate)) {
        possibleMoves.push(destination.clone());
      } else if (tileIsOccupiedByOpponent(destination, boardstate, bishop.team)) {
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