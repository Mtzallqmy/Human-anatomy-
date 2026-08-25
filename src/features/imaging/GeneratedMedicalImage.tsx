"use client";

import type { ImagingFrame } from "@/src/types/medical";

export function GeneratedMedicalImage({ frame }: { frame: ImagingFrame }) {
  const index = frame.index;
  const wave = Math.sin(index * 0.37);

  if (frame.generatedVariant === "chest-ct") {
    const lungScale = 0.82 + Math.sin((index / 27) * Math.PI) * 0.18;
    return (
      <svg viewBox="0 0 800 800" role="img" aria-label="Generated educational axial chest illustration">
        <defs>
          <radialGradient id="ct-body">
            <stop offset="0" stopColor="#aeb3b7" />
            <stop offset="1" stopColor="#565d62" />
          </radialGradient>
          <filter id="ct-soft">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <rect width="800" height="800" fill="#050708" />
        <ellipse cx="400" cy="405" rx="305" ry="275" fill="url(#ct-body)" stroke="#dce0e2" strokeWidth="12" />
        <ellipse
          cx="270"
          cy="390"
          rx={122 * lungScale}
          ry={190 * lungScale}
          fill="#111719"
          stroke="#858f94"
          strokeWidth="9"
        />
        <ellipse
          cx="530"
          cy="390"
          rx={122 * lungScale}
          ry={190 * lungScale}
          fill="#111719"
          stroke="#858f94"
          strokeWidth="9"
        />
        <ellipse cx="420" cy="475" rx="105" ry="128" fill="#858b8e" opacity=".93" filter="url(#ct-soft)" />
        <circle cx="396" cy="312" r="31" fill="#c7cacc" stroke="#f2f4f5" strokeWidth="6" />
        <circle cx="400" cy="625" r="54" fill="#e2e2dc" stroke="#fff" strokeWidth="7" />
        {Array.from({ length: 7 }, (_, i) => (
          <g key={i} opacity=".78">
            <path
              d={`M ${142 - i * 3} ${260 + i * 45} Q 90 400 ${155 - i * 2} ${540 - i * 28}`}
              fill="none"
              stroke="#eff0eb"
              strokeWidth="10"
            />
            <path
              d={`M ${658 + i * 3} ${260 + i * 45} Q 710 400 ${645 + i * 2} ${540 - i * 28}`}
              fill="none"
              stroke="#eff0eb"
              strokeWidth="10"
            />
          </g>
        ))}
        <text x="400" y="754" fill="#9ba4a8" textAnchor="middle" fontSize="18">
          EDUCATIONAL · GENERATED · SLICE {index + 1}
        </text>
      </svg>
    );
  }

  if (frame.generatedVariant === "brain-mri") {
    const inner = 170 + wave * 7;
    return (
      <svg viewBox="0 0 800 800" role="img" aria-label="Generated educational axial brain MRI illustration">
        <defs>
          <radialGradient id="mri-brain">
            <stop offset="0" stopColor="#8e9295" />
            <stop offset=".72" stopColor="#c6c9ca" />
            <stop offset="1" stopColor="#63686b" />
          </radialGradient>
        </defs>
        <rect width="800" height="800" fill="#050607" />
        <ellipse cx="400" cy="390" rx="286" ry="320" fill="#202326" stroke="#e0e2e2" strokeWidth="18" />
        <ellipse cx="400" cy="390" rx="245" ry="280" fill="url(#mri-brain)" />
        <ellipse cx="305" cy="382" rx={inner / 2} ry="205" fill="#8b9092" opacity=".74" />
        <ellipse cx="495" cy="382" rx={inner / 2} ry="205" fill="#8b9092" opacity=".74" />
        <path
          d="M345 355 Q400 315 455 355 Q430 390 400 375 Q370 390 345 355Z"
          fill="#e4e8e9"
          stroke="#f8ffff"
          strokeWidth="8"
        />
        <path
          d="M190 310 Q400 175 610 310 M175 410 Q400 290 625 410 M205 505 Q400 405 595 505"
          fill="none"
          stroke="#dadcdd"
          strokeWidth="8"
          opacity=".58"
        />
        <text x="400" y="754" fill="#9ba4a8" textAnchor="middle" fontSize="18">
          EDUCATIONAL · GENERATED · T2-LIKE · {index + 1}
        </text>
      </svg>
    );
  }

  if (frame.generatedVariant === "chest-xray") {
    return (
      <svg viewBox="0 0 800 800" role="img" aria-label="Generated educational chest projection illustration">
        <defs>
          <linearGradient id="xr-bg" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#2d363b" />
            <stop offset="1" stopColor="#090d0f" />
          </linearGradient>
        </defs>
        <rect width="800" height="800" fill="url(#xr-bg)" />
        <path
          d="M212 130 Q110 260 145 635 Q240 700 360 620 L365 195 Q292 115 212 130Z"
          fill="#11181b"
          stroke="#c9d1d2"
          strokeWidth="7"
        />
        <path
          d="M588 130 Q690 260 655 635 Q560 700 440 620 L435 195 Q508 115 588 130Z"
          fill="#11181b"
          stroke="#c9d1d2"
          strokeWidth="7"
        />
        <path d="M390 720 Q260 610 330 410 Q410 350 505 440 Q555 560 490 690Z" fill="#758084" opacity=".78" />
        {Array.from({ length: 10 }, (_, i) => (
          <path
            key={i}
            d={`M140 ${205 + i * 43} Q400 ${120 + i * 40} 660 ${205 + i * 43}`}
            fill="none"
            stroke="#d9dfdf"
            strokeWidth="7"
            opacity=".58"
          />
        ))}
        <path
          d="M160 650 Q280 610 390 675 M410 675 Q530 610 640 650"
          fill="none"
          stroke="#eef0eb"
          strokeWidth="13"
        />
        <rect x="385" y="95" width="30" height="590" rx="15" fill="#e6e8e4" opacity=".6" />
        <text x="400" y="765" fill="#aeb8ba" textAnchor="middle" fontSize="18">
          EDUCATIONAL · GENERATED · PA-LIKE
        </text>
      </svg>
    );
  }

  const kidney = frame.generatedVariant === "kidney-histology";
  return (
    <svg viewBox="0 0 800 800" role="img" aria-label="Generated educational histology illustration">
      <defs>
        <radialGradient id="hist-bg">
          <stop stopColor={kidney ? "#deb6df" : "#f0b8c1"} />
          <stop offset="1" stopColor={kidney ? "#80628e" : "#973e58"} />
        </radialGradient>
      </defs>
      <rect width="800" height="800" fill="url(#hist-bg)" />
      {Array.from({ length: 32 }, (_, i) => {
        const x = 60 + ((i * 137) % 680);
        const y = 70 + ((i * 223) % 650);
        const radius = kidney ? 27 + (i % 4) * 8 : 18 + (i % 5) * 5;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={radius}
            fill="none"
            stroke={kidney ? "#5f3d72" : "#70223d"}
            strokeWidth={kidney ? 11 : 7}
            opacity=".76"
          />
        );
      })}
      {!kidney && (
        <path
          d="M400 90 L400 710 M100 400 L700 400 M185 185 L615 615 M615 185 L185 615"
          stroke="#f2d3bc"
          strokeWidth="18"
          opacity=".55"
        />
      )}
      <text x="400" y="765" fill="#fff0ed" textAnchor="middle" fontSize="18">
        EDUCATIONAL · GENERATED HISTOLOGY PATTERN
      </text>
    </svg>
  );
}
