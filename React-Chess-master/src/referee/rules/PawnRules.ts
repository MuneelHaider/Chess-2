import { TeamType } from "../../Types";
import { Piece, Position } from "../../models";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";
import { Pawn } from "../../models/Pawn";

const isWithinBoard = (position: Position): boolean =>
  position.x >= 0 && position.x <= 7 && position.y >= 0 && position.y <= 7;

const isPawnStartRow = (team: TeamType, row: number): boolean =>
  team === TeamType.OUR ? row === 1 : row === 6;

const pawnDirection = (team: TeamType): number =>
  team === TeamType.OUR ? 1 : -1;

const isEnPassantTarget = (
  team: TeamType,
  target: Position,
  boardState: Piece[]
): boolean => {
  const capturePawnPosition = new Position(target.x, target.y - pawnDirection(team));
  const capturePawn = boardState.find(
    (piece) =>
      piece.samePosition(capturePawnPosition) &&
      piece.isPawn &&
      piece.team !== team &&
      (piece as Pawn).enPassant
  );

  return capturePawn !== undefined;
};

export const pawnMove = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  if (!isWithinBoard(desiredPosition)) {
    return false;
  }

  const direction = pawnDirection(team);
  const verticalDistance = desiredPosition.y - initialPosition.y;
  const horizontalDistance = desiredPosition.x - initialPosition.x;

  const isSingleForward =
    horizontalDistance === 0 && verticalDistance === direction;
  const isDoubleForward =
    horizontalDistance === 0 &&
    verticalDistance === 2 * direction &&
    isPawnStartRow(team, initialPosition.y);
  const isCaptureMove =
    Math.abs(horizontalDistance) === 1 && verticalDistance === direction;

  if (isSingleForward) {
    return !tileIsOccupied(desiredPosition, boardState);
  }

  if (isDoubleForward) {
    const intermediate = new Position(initialPosition.x, initialPosition.y + direction);
    return (
      !tileIsOccupied(desiredPosition, boardState) &&
      !tileIsOccupied(intermediate, boardState)
    );
  }

  if (isCaptureMove) {
    return (
      tileIsOccupiedByOpponent(desiredPosition, boardState, team) ||
      isEnPassantTarget(team, desiredPosition, boardState)
    );
  }

  return false;
};

export const getPossiblePawnMoves = (
  pawn: Piece,
  boardState: Piece[]
): Position[] => {
  const possibleMoves: Position[] = [];
  const direction = pawnDirection(pawn.team);
  const forwardOne = new Position(pawn.position.x, pawn.position.y + direction);
  const forwardTwo = new Position(pawn.position.x, pawn.position.y + 2 * direction);
  const captureOffsets = [-1, 1];

  if (isWithinBoard(forwardOne) && !tileIsOccupied(forwardOne, boardState)) {
    possibleMoves.push(forwardOne);

    if (
      isPawnStartRow(pawn.team, pawn.position.y) &&
      isWithinBoard(forwardTwo) &&
      !tileIsOccupied(forwardTwo, boardState)
    ) {
      possibleMoves.push(forwardTwo);
    }
  }

  for (const offset of captureOffsets) {
    const attackTarget = new Position(pawn.position.x + offset, pawn.position.y + direction);
    if (!isWithinBoard(attackTarget)) {
      continue;
    }

    if (tileIsOccupiedByOpponent(attackTarget, boardState, pawn.team)) {
      possibleMoves.push(attackTarget);
      continue;
    }

    const adjacentPawnPosition = new Position(pawn.position.x + offset, pawn.position.y);
    const adjacentPawn = boardState.find(
      (piece) =>
        piece.samePosition(adjacentPawnPosition) &&
        piece.isPawn &&
        piece.team !== pawn.team &&
        (piece as Pawn).enPassant
    );

    if (adjacentPawn) {
      possibleMoves.push(attackTarget);
    }
  }

  return possibleMoves;
};