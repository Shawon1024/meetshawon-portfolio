interface VerifiedBadgeProps {
  size?: number;
  className?: string;
}

export default function VerifiedBadge({
  size = 18,
  className = "",
}: VerifiedBadgeProps) {
  return (
    <span
      title="Verified"
      aria-label="Verified account"
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {/* Blue verified badge */}
        <path
          fill="#1877F2"
          d="M12 2.25l2.12 1.42 2.53-.32 1.12 2.29 2.29 1.12-.32 2.53L21.16 12l-1.42 2.12.32 2.53-2.29 1.12-1.12 2.29-2.53-.32L12 21.16l-2.12-1.42-2.53.32-1.12-2.29-2.29-1.12.32-2.53L2.84 12l1.42-2.12-.32-2.53 2.29-1.12 1.12-2.29 2.53.32L12 2.25z"
        />

        {/* White tick */}
        <path
          d="M8.1 12.2l2.45 2.45 5.35-5.35"
          fill="none"
          stroke="white"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}