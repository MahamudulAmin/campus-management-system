type SummaryCardProps = {
  title: string;
  value: number;
  color: string;
};

const SummaryCard = ({ title, value, color }: SummaryCardProps) => {
  return (
    <div
      style={{
        backgroundColor: color,
        color: "#fff",
        padding: "20px",
        borderRadius: "10px",
        width: "220px",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>{title}</h3>

      <h1
        style={{
          fontSize: "36px",
          margin: 0,
        }}
      >
        {value}
      </h1>
    </div>
  );
};

export default SummaryCard;