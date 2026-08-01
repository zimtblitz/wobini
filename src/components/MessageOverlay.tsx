interface Props {
  icon: string;
  message: string;
}

function MessageOverlay({
  icon,
  message,
}: Props) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1000 1000"
    >
      {/* Hintergrund */}
      <rect
        x="0"
        y="0"
        width="1000"
        height="1000"
        rx="32"
        fill="rgba(40,40,40,0.25)"
      />

      {/* Nachrichtfläche */}
      <rect
        x="100"
        y="380"
        width="800"
        height="240"
        rx="32"
        fill="rgba(70,70,70,0.85)"
      />

      {/* Icon */}
      <text
        x="500"
        y="480"
        textAnchor="middle"
        fontSize="72"
      >
        {icon}
      </text>

      {/* Text */}
      <text
        x="500"
        y="555"
        textAnchor="middle"
        fill="#E8E8E5"
        fontSize="32"
        fontWeight="500"
      >
        {message}
      </text>
    </svg>
  );
}

export default MessageOverlay;
