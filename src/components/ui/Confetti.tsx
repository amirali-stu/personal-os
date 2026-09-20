import { useEffect, useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
  velocityX: number;
  velocityY: number;
};

const COLORS = [
  "#a855f7",
  "#22c55e",
  "#3b82f6",
  "#eab308",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
];

type ConfettiProps = {
  active: boolean;
  onDone?: () => void;
};

export function Confetti({ active, onDone }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const created: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 30,
      y: 40 + (Math.random() - 0.5) * 20,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.8,
      velocityX: (Math.random() - 0.5) * 12,
      velocityY: -8 - Math.random() * 10,
    }));

    setParticles(created);

    const timer = setTimeout(() => {
      setParticles([]);
      onDone?.();
    }, 2800);

    return () => clearTimeout(timer);
  }, [active, onDone]);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute h-2.5 w-2.5 rounded-sm"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg) scale(${p.scale})`,
            animation: `confetti-fall 2.5s ease-out forwards`,
            // @ts-expect-error custom props for animation
            "--vx": `${p.velocityX}vw`,
            "--vy": `${p.velocityY + 40}vh`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--vx), var(--vy)) rotate(720deg) scale(0.3);
          }
        }
      `}</style>
    </div>
  );
}
