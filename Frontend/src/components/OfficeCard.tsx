type OfficeCardProps = {
  officeName: string;
  description: string;
  onViewServices?: () => void;
};

const OfficeCard = ({ officeName, description, onViewServices }: OfficeCardProps) => {
  return (
    <div
      style={{
        width: "260px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
        margin: "10px",
        transition: "0.3s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0px 4px 12px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0px 2px 8px rgba(0,0,0,0.15)";
      }}
    >
      <h3
        style={{
          margin: "0 0 10px",
          color: "#1E3A8A",
        }}
      >
        {officeName}
      </h3>

      <p
        style={{
          color: "#555",
          marginBottom: "20px",
        }}
      >
        {description}
      </p>

      <button
        onClick={onViewServices}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#2563EB",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#1d4ed8";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#2563EB";
        }}
      >
        View Services
      </button>
    </div>
  );
};

export default OfficeCard;