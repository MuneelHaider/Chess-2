import { useEffect, useState } from "react";
import { PieceType, TeamType } from "../../Types";
import { PlayerProfile, fetchPlayerProfiles } from "../../api/mockPlayerApi";
import PlayerInfo from "./PlayerInfo";
import MoveHistory from "./MoveHistory";

interface GamePanelProps {
  moveHistory: string[];
  capturedByWhite: PieceType[];
  capturedByBlack: PieceType[];
  capturedPointsByWhite: number;
  capturedPointsByBlack: number;
  leadText: string;
}

const defaultPlayers: Record<TeamType, PlayerProfile> = {
  [TeamType.OUR]: {
    team: TeamType.OUR,
    name: "White",
    elo: 1400,
    region: "Unknown",
    countryFlag: "",
    avatarUrl: "",
    initials: "W",
  },
  [TeamType.OPPONENT]: {
    team: TeamType.OPPONENT,
    name: "Black",
    elo: 1400,
    region: "Unknown",
    countryFlag: "",
    avatarUrl: "",
    initials: "B",
  },
};

export default function GamePanel({
  moveHistory,
  capturedByWhite,
  capturedByBlack,
  capturedPointsByWhite,
  capturedPointsByBlack,
  leadText,
}: GamePanelProps) {
  const [players, setPlayers] = useState<PlayerProfile[]>([]);

  useEffect(() => {
    fetchPlayerProfiles().then((profiles) => setPlayers(profiles));
  }, []);

  const playerMap = players.reduce<Record<TeamType, PlayerProfile>>((map, player) => {
    map[player.team] = player;
    return map;
  }, defaultPlayers);

  const whitePlayer = playerMap[TeamType.OUR];
  const blackPlayer = playerMap[TeamType.OPPONENT];

  return (
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
          gap: "14px",
          minHeight: "620px",
          maxHeight: "620px",
        }}
      >
        <div style={{ color: "white", fontSize: "14px", fontWeight: "bold" }}>
          Players
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <PlayerInfo
            player={whitePlayer}
            capturedPieces={capturedByWhite}
            capturedPoints={capturedPointsByWhite}
            capturedTeam={TeamType.OPPONENT}
          />
          <PlayerInfo
            player={blackPlayer}
            capturedPieces={capturedByBlack}
            capturedPoints={capturedPointsByBlack}
            capturedTeam={TeamType.OUR}
          />
        </div>

        <div
          style={{
            color: "#fff",
            fontSize: "12px",
            backgroundColor: "#1f1f1f",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            padding: "10px 12px",
          }}
        >
          Lead: {leadText}
        </div>

        <MoveHistory moveHistory={moveHistory} />
      </div>
    </div>
  );
}
