type SummaryCardProps = {
  title: string;
  value: number;
  color: string;
};

const SummaryCard = ({ title, value, color }: SummaryCardProps) => {
  return (
    <div
      style={{
        background: color,
        color: "#fff",
        borderRadius: "12px",
        padding: "20px",
        minHeight: "120px",
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxShadow: "0 6px 15px rgba(0,0,0,0.12)",
        transition: "0.3s",
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: "16px",
          fontWeight: 500,
          opacity: 0.9,
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          marginTop: "15px",
          marginBottom: 0,
          fontSize: "38px",
          fontWeight: "bold",
        }}
      >
        {value}
      </h1>
    </div>
  );
};

export default SummaryCard;