import { CSSProperties } from 'react';

type CalcVerseLogoProps = {
  animated?: boolean;
  size?: number;
  variant?: 'icon' | 'wordmark';
  className?: string;
};

const gradientId = 'calcverse-gradient';
const glowId = 'calcverse-glow';

export function CalcVerseLogo({
  animated = false,
  size = 48,
  variant = 'wordmark',
  className,
}: CalcVerseLogoProps) {
  const width = variant === 'icon' ? size : size * 5;
  const viewBox = variant === 'icon' ? '0 0 48 48' : '0 0 240 48';
  const spinStyle: CSSProperties = animated
    ? { transformOrigin: '24px 24px', animation: 'calcverse-spin 20s linear infinite' }
    : {};

  return (
    <svg
      className={className}
      width={width}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="CalcVerse logo"
    >
      <defs>
        <linearGradient id={gradientId} x1="6" y1="8" x2="42" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g style={spinStyle}>
        <path
          d="M4 24C8 11 16 11 24 24C32 37 40 37 44 24"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.8"
          strokeLinecap="round"
          filter={`url(#${glowId})`}
        />
        <path
          d="M4 24C8 37 16 37 24 24C32 11 40 11 44 24"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.8"
          strokeLinecap="round"
          filter={`url(#${glowId})`}
        />
      </g>
      <circle cx="24" cy="24" r="2.2" fill="#06b6d4" filter={`url(#${glowId})`} />

      {variant === 'wordmark' && (
        <g transform="translate(58 28)" aria-hidden="true">
          <text
            x="0"
            y="0"
            fontFamily="'JetBrains Mono', 'Courier New', monospace"
            fontSize="23"
            fontWeight="300"
            fill="#dbeafe"
            letterSpacing="0.4"
          >
            Calc
          </text>
          <text
            x="58"
            y="0"
            fontFamily="'JetBrains Mono', 'Courier New', monospace"
            fontSize="23"
            fontWeight="700"
            fill="url(#calcverse-gradient)"
            letterSpacing="0.2"
          >
            Verse
          </text>
        </g>
      )}
    </svg>
  );
}