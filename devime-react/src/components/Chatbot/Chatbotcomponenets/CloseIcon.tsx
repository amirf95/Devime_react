import { CSSProperties } from "react";

interface CloseIconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

export const CloseIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
  style = {},
}: CloseIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      style={style}
      role="img"
      aria-hidden="true"
    >
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
};