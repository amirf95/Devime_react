import React from "react";

const SendIcon = ({ width = 25, height = 25, color = "currentColor", className = "", style = {} }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      style={style}
      role="img"
      aria-hidden="true"
    >
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
};

export default SendIcon;
