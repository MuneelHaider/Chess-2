import { PieceType, TeamType } from "../../Types";
import { PlayerProfile } from "../../api/mockPlayerApi";

interface PlayerInfoProps {
  player: PlayerProfile;
  capturedPieces: PieceType[];
  capturedPoints: number;
  capturedTeam: TeamType;
}

const capturedPieceImages = (capturedPieces: PieceType[], team: TeamType) =>
  capturedPieces.map((type, index) => (
    <img
      key={`${type}-${index}`}
      src={`/assets/images/${type}_${team}.png`}
      alt={type}
      style={{ width: 20, height: 20, marginRight: 4, opacity: 0.9 }}
    />
  ));

export default function PlayerInfo({
  player,
  capturedPieces,
  capturedPoints,
  capturedTeam,
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
        padding: "10px",
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
        <div style={{ color: "#fff", fontWeight: "bold", fontSize: "14px" }}>
          {player.name}
        </div>
        <div style={{ color: "#ccc", fontSize: "12px", marginTop: "4px" }}>
          {player.elo} • {player.countryFlag} {player.region}
        </div>
        <div
          style={{
            color: "#ccc",
            fontSize: "12px",
            marginTop: "6px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontWeight: "bold", color: "#fff" }}>
            Captured {capturedPieces.length} ({capturedPoints})
          </span>
          {capturedPieceImages(capturedPieces, capturedTeam)}
        </div>
      </div>
    </div>
  );
}
