import { useRef, useState } from "react";
import { initialBoard } from "../../Constants";
import { Piece, Position } from "../../models";
import { Board } from "../../models/Board";
import { Pawn } from "../../models/Pawn";
import { PieceType, TeamType } from "../../Types";
import Chessboard from "../Chessboard/Chessboard";
import { Howl } from "howler";
import { moveToAlgebraicNotation, formatMoveHistory } from "../../utils/algebraicNotation";

const moveSound = new Howl({
  src: ["/sounds/move-self.mp3"],
});

const checkmateSound = new Howl({
  src: ["/sounds/move-check.mp3"],
});

export default function Referee() {
  const [board, setBoard] = useState<Board>(initialBoard.clone());
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const checkmateModalRef = useRef<HTMLDivElement>(null);

  function playMove(playedPiece: Piece, destination: Position): boolean {
    if (playedPiece.possibleMoves === undefined) return false;

    if (playedPiece.team === TeamType.OUR && board.totalTurns % 2 !== 1)
      return false;
    if (playedPiece.team === TeamType.OPPONENT && board.totalTurns % 2 !== 0)
      return false;

    const validMove = playedPiece.possibleMoves.some((m) =>
      m.samePosition(destination)
    );

    if (!validMove) return false;

    const enPassantMove = isEnPassantMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    );

    let playedMoveIsValid = false;

    setBoard((previousBoard) => {
      const clonedBoard = previousBoard.clone();
      clonedBoard.totalTurns += 1;

      playedMoveIsValid = clonedBoard.playMove(
        enPassantMove,
        validMove,
        playedPiece,
        destination
      );

      if (playedMoveIsValid) {
        moveSound.play();

        // Determine if there was a capture
        const capturedPiece = previousBoard.pieces.find((p) =>
          p.samePosition(destination)
        );

        // Check if it's a castling move
        const isCastling =
          playedPiece.isKing &&
          capturedPiece?.isRook &&
          capturedPiece.team === playedPiece.team;

        // Convert move to algebraic notation
        const notation = moveToAlgebraicNotation(
          playedPiece,
          playedPiece.position,
          destination,
          capturedPiece,
          false,
          undefined,
          isCastling
        );

        // Add move to history
        setMoveHistory((prevHistory) => [...prevHistory, notation]);
      }

      if (clonedBoard.winningTeam !== undefined) {
        checkmateModalRef.current?.classList.remove("hidden");
        checkmateSound.play();
      }

      return clonedBoard;
    });

    if (playedMoveIsValid && playedPiece.isPawn) {
      const promotionRow = playedPiece.team === TeamType.OUR ? 7 : 0;
      if (destination.y === promotionRow) {
        modalRef.current?.classList.remove("hidden");
        setPromotionPawn(() => {
          const clonedPlayedPiece = playedPiece.clone();
          clonedPlayedPiece.position = destination.clone();
          return clonedPlayedPiece;
        });
      }
    }

    return playedMoveIsValid;
  }

  function isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType
  ) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = board.pieces.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.isPawn &&
            (p as Pawn).enPassant
        );
        if (piece) {
          return true;
        }
      }
    }

    return false;
  }

  function promotePawn(pieceType: PieceType) {
    if (promotionPawn === undefined) {
      return;
    }

    setBoard((previousBoard) => {
      const clonedBoard = previousBoard.clone();
      clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
        if (piece.samePiecePosition(promotionPawn)) {
          results.push(
            new Piece(piece.position.clone(), pieceType, piece.team, true)
          );
        } else {
          results.push(piece);
        }
        return results;
      }, [] as Piece[]);

      clonedBoard.calculateAllMoves();

      return clonedBoard;
    });

    modalRef.current?.classList.add("hidden");
  }

  function promotionTeamType() {
    return promotionPawn?.team === TeamType.OUR ? "w" : "b";
  }

  function restartGame() {
    checkmateModalRef.current?.classList.add("hidden");
    setBoard(initialBoard.clone());
    setMoveHistory([]);
  }

  const currentTeam = board.totalTurns % 2 === 1 ? TeamType.OUR : TeamType.OPPONENT;
  const isWhitesTurn = currentTeam === TeamType.OUR;

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <p style={{ color: "white", fontSize: "24px", fontWeight: "bold", margin: 0 }}>
          {isWhitesTurn ? "White's Turn" : "Black's Turn"}
        </p>
        
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", justifyContent: "center" }}>
          <div style={{ flexShrink: 0 }}>
            <Chessboard playMove={playMove} pieces={board.pieces} />
          </div>
          <div
            style={{
              width: "320px",
              minHeight: "800px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              backgroundColor: "#1f1f1f",
              border: "2px solid #444",
              borderRadius: "10px",
              padding: "16px",
            }}
          >
            <div style={{ color: "white", fontSize: "18px", fontWeight: "bold", textAlign: "center" }}>
              Game Panel
            </div>
            <div
              style={{
                backgroundColor: "#2a2a2a",
                border: "2px solid #555",
                borderRadius: "6px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                minHeight: "620px",
                maxHeight: "620px",
              }}
            >
              <div style={{ color: "white", fontSize: "14px", fontWeight: "bold", marginBottom: "12px" }}>
                Moves
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 1fr 1fr",
                  gap: "12px",
                  marginBottom: "12px",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                <div style={{ opacity: 0.7 }}></div>
                <div>White</div>
                <div>Black</div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", color: "#ccc", fontSize: "12px", lineHeight: "1.8" }}>
                {moveHistory.length === 0 ? (
                  <div style={{ color: "#888" }}>No moves yet</div>
                ) : (
                  formatMoveHistory(moveHistory).map((row, index) => (
                    <div
                      key={index}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "40px 1fr 1fr",
                        gap: "12px",
                        padding: "4px 0",
                        borderBottom: index < Math.ceil(moveHistory.length / 2) - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                      }}
                    >
                      <span style={{ color: "#fff", fontWeight: "bold" }}>{row[0]}</span>
                      <span>{row[1]}</span>
                      <span>{row[2]}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal hidden" ref={modalRef}>
        <div className="modal-body">
          <img
            onClick={() => promotePawn(PieceType.ROOK)}
            src={`/assets/images/rook_${promotionTeamType()}.png`}
            alt="Rook"
          />
          <img
            onClick={() => promotePawn(PieceType.BISHOP)}
            src={`/assets/images/bishop_${promotionTeamType()}.png`}
            alt="Bishop"
          />
          <img
            onClick={() => promotePawn(PieceType.KNIGHT)}
            src={`/assets/images/knight_${promotionTeamType()}.png`}
            alt="Knight"
          />
          <img
            onClick={() => promotePawn(PieceType.QUEEN)}
            src={`/assets/images/queen_${promotionTeamType()}.png`}
            alt="Queen"
          />
        </div>
      </div>
      <div className="modal hidden" ref={checkmateModalRef}>
        <div className="modal-body">
          <div className="checkmate-body">
            <span>
              The winning team is{" "}
              {board.winningTeam === TeamType.OUR ? "white" : "black"}!
            </span>
            <button onClick={restartGame}>Play again</button>
          </div>
        </div>
      </div>
    </>
  );
}
