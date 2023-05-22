import React from "react";

interface HourDisplayProps {
  hours: string;
}

const HourDisplay: React.FC<HourDisplayProps> = ({ hours }) => {
  if (hours === "closed") {
    return <p className="text-dark">Hours - Closed Today</p>;
  }

  const formatHours = (time: string) => {
    if (time.slice(0, 2) === "12") return `12:${time.slice(2, 4)} pm`;
    if (parseInt(time.slice(0, 4)) < 1200) {
      if (time.slice(0, 2) === "00") return `12:${time.slice(2, 4)} am`;
      return `${time.slice(0, 2)}:${time.slice(2, 4)} am`;
    }
    return `${parseFloat(time.slice(0, 2)) % 12}:${time.slice(2, 4)} pm`;
  };

  return (
    <p className="text-dark">
      Hours - {formatHours(hours.slice(0, 4))} -{" "}
      {formatHours(hours.slice(5, 9))}
    </p>
  );
};

export default HourDisplay;
