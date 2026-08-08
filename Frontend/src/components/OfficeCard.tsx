import React from "react";
import { useNavigate } from "react-router-dom";


type OfficeCardProps = {
  officeName: string;
  description: string;
};


const OfficeCard = ({
  officeName,
  description,
}: OfficeCardProps) => {


  const navigate = useNavigate();


  const handleOfficeClick = () => {

    navigate("/offices");

  };


  return (

    <div
      onClick={handleOfficeClick}

      style={{
        backgroundColor: "#ffffff",
        borderRadius: "18px",
        padding: "20px",
        width: "280px",
        boxShadow:
          "0 10px 30px rgba(15, 23, 42, 0.08)",
        cursor: "pointer",
        transition:
          "transform 0.2s ease, box-shadow 0.2s ease",
      }}

      onMouseEnter={(e) => {

        e.currentTarget.style.transform =
          "translateY(-5px)";

        e.currentTarget.style.boxShadow =
          "0 15px 35px rgba(15, 23, 42, 0.15)";

      }}

      onMouseLeave={(e) => {

        e.currentTarget.style.transform =
          "translateY(0)";

        e.currentTarget.style.boxShadow =
          "0 10px 30px rgba(15, 23, 42, 0.08)";

      }}

    >

      <h3
        style={{
          marginTop: 0,
          color: "#1e40af",
        }}
      >
        {officeName}
      </h3>


      <p
        style={{
          marginBottom: 0,
          color: "#475569",
        }}
      >
        {description}
      </p>


    </div>

  );

};


export default OfficeCard;