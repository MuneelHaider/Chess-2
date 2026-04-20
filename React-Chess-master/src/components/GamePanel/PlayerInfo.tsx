import { PieceType, TeamType } from "../../Types";
import { PlayerProfile } from "../../api/mockPlayerApi";

interface PlayerInfoProps {
  player: PlayerProfile;
  capturedPieces: PieceType[];
  capturedPoints: number;
  capturedTeam: TeamType;
  leadValue?: number;
}

const piecePriority: Record<PieceType, number> = {
  [PieceType.PAWN]: 0,
  [PieceType.BISHOP]: 1,
  [PieceType.KNIGHT]: 2,
  [PieceType.ROOK]: 3,
  [PieceType.QUEEN]: 4,
  [PieceType.KING]: 5,
};

const pieceGroups = (
  capturedPieces: PieceType[],
  team: TeamType
): Array<{ type: PieceType; count: number }> => {
  const counts = capturedPieces.reduce<Record<PieceType, number>>((groups, piece) => {
    groups[piece] = (groups[piece] || 0) + 1;
    return groups;
  }, {
    [PieceType.PAWN]: 0,
    [PieceType.BISHOP]: 0,
    [PieceType.KNIGHT]: 0,
    [PieceType.ROOK]: 0,
    [PieceType.QUEEN]: 0,
    [PieceType.KING]: 0,
  });

  return (Object.keys(counts) as PieceType[])
    .sort((a, b) => piecePriority[a] - piecePriority[b])
    .filter((type) => counts[type] > 0)
    .map((type) => ({ type, count: counts[type] }));
};

const capturedPieceGroups = (capturedPieces: PieceType[], team: TeamType) => {
  return pieceGroups(capturedPieces, team).map(({ type, count }) => (
    <div key={type} style={{ display: "flex", alignItems: "center", marginRight: 8 }}>
      {Array.from({ length: count }).map((_, index) => (
        <img
          key={`${type}-${index}`}
          src={`/assets/images/${type}_${team}.png`}
          alt={type}
          style={{
            width: 18,
            height: 18,
            marginLeft: index === 0 ? 0 : -8,
            zIndex: 100 - index,
            opacity: 0.95,
          }}
        />
      ))}
    </div>
  ));
};

export default function PlayerInfo({
  player,
  capturedPieces,
  capturedPoints,
  capturedTeam,
  leadValue,
}: PlayerInfoProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backgroundColor: "#232323",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "8px",
        padding: "12px",
      }}
    >
      <div
        style={{
          width: "54px",
          height: "54px",
          borderRadius: "50%",
          backgroundColor: player.avatarUrl ? "transparent" : "#4b6cb7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: "20px",
          overflow: "hidden",
        }}
      >
        {player.avatarUrl ? (
          <img
            src={player.avatarUrl}
            alt={player.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          player.initials
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: "14px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {player.name} ({player.elo})
        </div>
        <div style={{ color: "#ccc", fontSize: "12px", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
          {player.countryFlag && <span>{player.countryFlag}</span>}
          <span>{player.region}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", minWidth: 0, gap: 8 }}>
            {capturedPieceGroups(capturedPieces, capturedTeam)}
          </div>
          {leadValue !== undefined && leadValue > 0 ? (
            <span
              style={{
                color: "#9df29d",
                fontWeight: "bold",
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              +{leadValue}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
