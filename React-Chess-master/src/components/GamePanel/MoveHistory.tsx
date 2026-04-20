import { formatMoveHistory } from "../../utils/algebraicNotation";

interface MoveHistoryProps {
  moveHistory: string[];
}

export default function MoveHistory({ moveHistory }: MoveHistoryProps) {
  return (
    <div
      style={{
        backgroundColor: "#1f1f1f",
        borderRadius: "8px",
        padding: "14px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
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
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", color: "#ccc", fontSize: "12px", lineHeight: "1.8" }}>
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
  );
}
