export function Logo({
  size = 48,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size * 0.7}
      height={size}
      viewBox="0 0 70 100"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M35 0 C36 36, 44 46, 70 50 C44 54, 36 64, 35 100 C34 64, 26 54, 0 50 C26 46, 34 36, 35 0Z" />
    </svg>
  );
}
