import { CSSProperties } from "react";

interface ArrowDownProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

export const ArrowDown = ({
  width = 40,
  height = 25,
  color = "white",
  className = "",
  style = {}
}: ArrowDownProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 1024 1024"
      className={className}
      style={style}
      aria-hidden="true"
      role="img"
    >
      <path
        fill={color}
        d="M512 896L896 512H640V256H384v256H128l384 384z"
      />
    </svg>
  );
};