"use client";

import type { ImagingFrame } from "@/src/types/medical";

function Footer({ label }: { label: string }) {
  return (
    <text x="400" y="765" fill="#aeb8ba" textAnchor="middle" fontSize="18">
      EDUCATIONAL · GENERATED · {label}
    </text>
  );
}

function UltrasoundImage({ variant, index }: { variant: string; index: number }) {
  const pulse = Math.sin(index * 0.44) * 10;
  const thyroid = variant === "thyroid-ultrasound";
  const lymph = variant === "lymph-node-ultrasound";
  return (
    <svg viewBox="0 0 800 800" role="img" aria-label="Generated educational ultrasound illustration">
      <defs>
        <radialGradient id="us-field">
          <stop stopColor="#6d7376" />
          <stop offset=".55" stopColor="#24292c" />
          <stop offset="1" stopColor="#07090a" />
        </radialGradient>
        <filter id="us-grain">
          <feTurbulence baseFrequency=".8" numOctaves="2" seed={index + 3} type="fractalNoise" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .14 0" />
        </filter>
      </defs>
      <rect width="800" height="800" fill="#040607" />
      <path d="M115 120 L685 120 L620 700 L180 700Z" fill="url(#us-field)" stroke="#8c9699" strokeWidth="4" />
      <rect x="125" y="130" width="550" height="560" filter="url(#us-grain)" opacity=".8" />
      {thyroid ? (
        <>
          <ellipse cx="300" cy="400" rx={118 + pulse} ry="150" fill="#979d9e" opacity=".55" stroke="#d9dddd" strokeWidth="8" />
          <ellipse cx="500" cy="400" rx={118 - pulse / 2} ry="150" fill="#979d9e" opacity=".55" stroke="#d9dddd" strokeWidth="8" />
          <rect x="365" y="385" width="70" height="36" rx="18" fill="#b7bdbd" opacity=".7" />
          <circle cx="400" cy="300" r="72" fill="#111719" stroke="#cdd1d2" strokeWidth="7" />
        </>
      ) : lymph ? (
        <>
          <ellipse cx="400" cy="405" rx={205 + pulse} ry="115" fill="#565d60" stroke="#d2d6d7" strokeWidth="9" />
          <ellipse cx="400" cy="405" rx="112" ry="42" fill="#c3c8c9" opacity=".82" />
          <path d="M200 565 Q400 470 610 560" fill="none" stroke="#858e91" strokeWidth="22" opacity=".6" />
        </>
      ) : (
        <>
          <path d="M285 510 Q300 315 430 270 Q575 360 505 540 Q385 605 285 510Z" fill="#8a9092" opacity=".72" stroke="#dde0e1" strokeWidth="8" />
          <ellipse cx="555" cy="440" rx="72" ry="52" fill="#575e61" stroke="#c9cdce" strokeWidth="7" />
          <ellipse cx="555" cy="440" rx="25" ry="18" fill="#c5cbcc" />
        </>
      )}
      <path d="M135 200 H180 M135 300 H180 M135 400 H180 M135 500 H180 M135 600 H180" stroke="#c5cecf" strokeWidth="4" opacity=".65" />
      <Footer label={`${thyroid ? "THYROID" : lymph ? "LYMPH NODE" : "PELVIC"} ULTRASOUND-LIKE · ${index + 1}`} />
    </svg>
  );
}

export function GeneratedMedicalImage({ frame }: { frame: ImagingFrame }) {
  const index = frame.index;
  const wave = Math.sin(index * 0.37);

  if (["thyroid-ultrasound", "lymph-node-ultrasound", "pelvic-ultrasound"].includes(frame.generatedVariant ?? "")) {
    return <UltrasoundImage variant={frame.generatedVariant ?? "pelvic-ultrasound"} index={index} />;
  }

  if (frame.generatedVariant === "bone-xray") {
    const narrowing = index * 3;
    return (
      <svg viewBox="0 0 800 800" role="img" aria-label="Generated educational long-bone X-ray illustration">
        <defs>
          <linearGradient id="bone-bg" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#263035" />
            <stop offset="1" stopColor="#080b0d" />
          </linearGradient>
          <linearGradient id="cortex" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#f5f1e8" />
            <stop offset=".5" stopColor="#92999b" />
            <stop offset="1" stopColor="#f5f1e8" />
          </linearGradient>
        </defs>
        <rect width="800" height="800" fill="url(#bone-bg)" />
        <ellipse cx="400" cy="165" rx={145 - narrowing} ry="105" fill="#d5d7d2" opacity=".9" />
        <rect x="315" y="150" width="170" height="500" rx="74" fill="url(#cortex)" />
        <rect x="355" y="205" width="90" height="390" rx="44" fill="#4d5559" opacity=".9" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M330 ${185 + i * 31} L470 ${230 + i * 25} M470 ${185 + i * 31} L330 ${230 + i * 25}`} stroke="#e2ded3" strokeWidth="4" opacity=".48" />
        ))}
        <ellipse cx="400" cy="650" rx={145 - narrowing} ry="105" fill="#d5d7d2" opacity=".9" />
        <Footer label={`LONG-BONE XRAY-LIKE · ${index + 1}`} />
      </svg>
    );
  }

  if (frame.generatedVariant === "muscle-mri") {
    return (
      <svg viewBox="0 0 800 800" role="img" aria-label="Generated educational muscle MRI illustration">
        <defs>
          <radialGradient id="muscle-bg"><stop stopColor="#b4b7b9" /><stop offset="1" stopColor="#555b5f" /></radialGradient>
        </defs>
        <rect width="800" height="800" fill="#050708" />
        <ellipse cx="400" cy="390" rx="300" ry="270" fill="url(#muscle-bg)" stroke="#dadddf" strokeWidth="12" />
        {[[285,300,105,120],[505,300,105,120],[265,505,115,105],[535,505,115,105],[400,470,95,150]].map(([cx,cy,rx,ry], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={rx + wave * 3} ry={ry} fill="#73797c" stroke="#c1c5c6" strokeWidth="6" opacity=".92" />
        ))}
        <circle cx="400" cy="360" r="46" fill="#efede4" stroke="#fff" strokeWidth="6" />
        <path d="M575 250 Q630 390 575 560" fill="none" stroke="#f1e1c4" strokeWidth="24" opacity=".78" />
        <Footer label={`MUSCLE MRI-LIKE · ${index + 1}`} />
      </svg>
    );
  }

  if (frame.generatedVariant === "skin-histology") {
    return (
      <svg viewBox="0 0 800 800" role="img" aria-label="Generated educational skin histology illustration">
        <rect width="800" height="800" fill="#f1cfbb" />
        <path d="M0 100 Q80 60 160 105 T320 100 T480 95 T640 105 T800 95 V235 H0Z" fill="#bd6d77" />
        <path d="M0 235 H800 V555 Q690 525 590 570 T390 550 T190 570 T0 545Z" fill="#d99aa0" />
        <path d="M0 555 Q100 520 190 585 T390 570 T590 590 T800 555 V800 H0Z" fill="#dfc06d" />
        {Array.from({ length: 45 }, (_, i) => <circle key={i} cx={30 + ((i * 83) % 745)} cy={135 + ((i * 97) % 390)} r={5 + (i % 4)} fill="#6e3651" opacity=".58" />)}
        <path d="M560 220 Q500 310 535 485 Q590 525 625 450 Q645 310 590 220" fill="none" stroke="#7e4c54" strokeWidth="18" />
        <path d="M250 360 Q190 420 235 520 Q300 535 322 470 Q315 400 250 360Z" fill="none" stroke="#8b5369" strokeWidth="13" />
        <Footer label={`SKIN HISTOLOGY · ${index + 1}`} />
      </svg>
    );
  }

  if (frame.generatedVariant === "chest-ct") {
    const lungScale = 0.82 + Math.sin((index / 27) * Math.PI) * 0.18;
    return (
      <svg viewBox="0 0 800 800" role="img" aria-label="Generated educational axial chest illustration">
        <defs>
          <radialGradient id="ct-body"><stop offset="0" stopColor="#aeb3b7" /><stop offset="1" stopColor="#565d62" /></radialGradient>
          <filter id="ct-soft"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>
        <rect width="800" height="800" fill="#050708" />
        <ellipse cx="400" cy="405" rx="305" ry="275" fill="url(#ct-body)" stroke="#dce0e2" strokeWidth="12" />
        <ellipse cx="270" cy="390" rx={122 * lungScale} ry={190 * lungScale} fill="#111719" stroke="#858f94" strokeWidth="9" />
        <ellipse cx="530" cy="390" rx={122 * lungScale} ry={190 * lungScale} fill="#111719" stroke="#858f94" strokeWidth="9" />
        <ellipse cx="420" cy="475" rx="105" ry="128" fill="#858b8e" opacity=".93" filter="url(#ct-soft)" />
        <circle cx="396" cy="312" r="31" fill="#c7cacc" stroke="#f2f4f5" strokeWidth="6" />
        <circle cx="400" cy="625" r="54" fill="#e2e2dc" stroke="#fff" strokeWidth="7" />
        {Array.from({ length: 7 }, (_, i) => <g key={i} opacity=".78"><path d={`M ${142 - i * 3} ${260 + i * 45} Q 90 400 ${155 - i * 2} ${540 - i * 28}`} fill="none" stroke="#eff0eb" strokeWidth="10" /><path d={`M ${658 + i * 3} ${260 + i * 45} Q 710 400 ${645 + i * 2} ${540 - i * 28}`} fill="none" stroke="#eff0eb" strokeWidth="10" /></g>)}
        <Footer label={`CT-LIKE SLICE ${index + 1}`} />
      </svg>
    );
  }

  if (frame.generatedVariant === "brain-mri") {
    const inner = 170 + wave * 7;
    return (
      <svg viewBox="0 0 800 800" role="img" aria-label="Generated educational axial brain MRI illustration">
        <defs><radialGradient id="mri-brain"><stop offset="0" stopColor="#8e9295" /><stop offset=".72" stopColor="#c6c9ca" /><stop offset="1" stopColor="#63686b" /></radialGradient></defs>
        <rect width="800" height="800" fill="#050607" />
        <ellipse cx="400" cy="390" rx="286" ry="320" fill="#202326" stroke="#e0e2e2" strokeWidth="18" />
        <ellipse cx="400" cy="390" rx="245" ry="280" fill="url(#mri-brain)" />
        <ellipse cx="305" cy="382" rx={inner / 2} ry="205" fill="#8b9092" opacity=".74" />
        <ellipse cx="495" cy="382" rx={inner / 2} ry="205" fill="#8b9092" opacity=".74" />
        <path d="M345 355 Q400 315 455 355 Q430 390 400 375 Q370 390 345 355Z" fill="#e4e8e9" stroke="#f8ffff" strokeWidth="8" />
        <path d="M190 310 Q400 175 610 310 M175 410 Q400 290 625 410 M205 505 Q400 405 595 505" fill="none" stroke="#dadcdd" strokeWidth="8" opacity=".58" />
        <Footer label={`T2-LIKE · ${index + 1}`} />
      </svg>
    );
  }

  if (frame.generatedVariant === "chest-xray") {
    return (
      <svg viewBox="0 0 800 800" role="img" aria-label="Generated educational chest projection illustration">
        <defs><linearGradient id="xr-bg" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#2d363b" /><stop offset="1" stopColor="#090d0f" /></linearGradient></defs>
        <rect width="800" height="800" fill="url(#xr-bg)" />
        <path d="M212 130 Q110 260 145 635 Q240 700 360 620 L365 195 Q292 115 212 130Z" fill="#11181b" stroke="#c9d1d2" strokeWidth="7" />
        <path d="M588 130 Q690 260 655 635 Q560 700 440 620 L435 195 Q508 115 588 130Z" fill="#11181b" stroke="#c9d1d2" strokeWidth="7" />
        <path d="M390 720 Q260 610 330 410 Q410 350 505 440 Q555 560 490 690Z" fill="#758084" opacity=".78" />
        {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M140 ${205 + i * 43} Q400 ${120 + i * 40} 660 ${205 + i * 43}`} fill="none" stroke="#d9dfdf" strokeWidth="7" opacity=".58" />)}
        <path d="M160 650 Q280 610 390 675 M410 675 Q530 610 640 650" fill="none" stroke="#eef0eb" strokeWidth="13" />
        <rect x="385" y="95" width="30" height="590" rx="15" fill="#e6e8e4" opacity=".6" />
        <Footer label="PA-LIKE" />
      </svg>
    );
  }

  const kidney = frame.generatedVariant === "kidney-histology";
  return (
    <svg viewBox="0 0 800 800" role="img" aria-label="Generated educational histology illustration">
      <defs><radialGradient id="hist-bg"><stop stopColor={kidney ? "#deb6df" : "#f0b8c1"} /><stop offset="1" stopColor={kidney ? "#80628e" : "#973e58"} /></radialGradient></defs>
      <rect width="800" height="800" fill="url(#hist-bg)" />
      {Array.from({ length: 32 }, (_, i) => {
        const x = 60 + ((i * 137) % 680);
        const y = 70 + ((i * 223) % 650);
        const radius = kidney ? 27 + (i % 4) * 8 : 18 + (i % 5) * 5;
        return <circle key={i} cx={x} cy={y} r={radius} fill="none" stroke={kidney ? "#5f3d72" : "#70223d"} strokeWidth={kidney ? 11 : 7} opacity=".76" />;
      })}
      {!kidney && <path d="M400 90 L400 710 M100 400 L700 400 M185 185 L615 615 M615 185 L185 615" stroke="#f2d3bc" strokeWidth="18" opacity=".55" />}
      <Footer label="HISTOLOGY PATTERN" />
    </svg>
  );
}
