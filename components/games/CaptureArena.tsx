"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ArenaShape, TrialPhase } from "@/lib/types";

type CaptureArenaProps = {
  shapes: ArenaShape[];
  phase: TrialPhase;
  disabled: boolean;
  onShapeTap: (shapeId: string) => void;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function colorClassName(shape: ArenaShape): string {
  switch (shape.kind) {
    case "target":
      return "bg-blue-600 ring-2 ring-blue-900/20";
    case "distractor-fake":
      return "bg-blue-400 ring-2 ring-dashed ring-white/90";
    case "distractor-red-static":
      return "bg-red-500";
    case "distractor-red-flash":
      return "animate-pulse bg-red-500";
    case "distractor-moving":
      return "bg-orange-500";
    default:
      return "bg-zinc-500";
  }
}

function variantClassName(variant: ArenaShape["variant"]): string {
  switch (variant) {
    case "circle":
      return "rounded-full";
    case "square":
      return "rounded-md";
    case "diamond":
      return "rounded-sm";
    case "triangle":
      return "rounded-none";
    default:
      return "rounded-full";
  }
}

function shapeStyle(shape: ArenaShape): CSSProperties {
  const style: CSSProperties = {
    left: `${shape.x}%`,
    top: `${shape.y}%`,
    width: shape.size,
    height: shape.size,
    transform: `translate(-50%, -50%) rotate(${shape.rotation ?? 0}deg)`,
  };

  if (shape.variant === "triangle") {
    style.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
  }

  if (shape.variant === "diamond") {
    style.transform = `translate(-50%, -50%) rotate(${45 + (shape.rotation ?? 0)}deg)`;
  }

  return style;
}

function updateMovingShape(shape: ArenaShape): ArenaShape {
  if (shape.kind !== "distractor-moving" || shape.vx === undefined) {
    return shape;
  }

  let x = shape.x;
  let y = shape.y;
  let vx = shape.vx;
  let vy = shape.vy ?? 0;
  let wobblePhase = (shape.wobblePhase ?? 0) + (shape.wobbleSpeed ?? 0.15);
  let erraticTimer = (shape.erraticTimer ?? 15) - 1;
  let rotation = (shape.rotation ?? 0) + randomSpin(vx, vy);

  if (erraticTimer <= 0) {
    vx += (Math.random() - 0.5) * 0.35;
    vy += (Math.random() - 0.5) * 0.35;

    if (Math.random() < 0.35) {
      const jerkAngle = Math.random() * Math.PI * 2;
      vx += Math.cos(jerkAngle) * 0.22;
      vy += Math.sin(jerkAngle) * 0.22;
    }

    vx = clamp(vx, -0.42, 0.42);
    vy = clamp(vy, -0.42, 0.42);
    erraticTimer = 6 + Math.floor(Math.random() * 18);
  }

  const wobbleX = Math.sin(wobblePhase) * 0.14 + Math.sin(wobblePhase * 2.7) * 0.05;
  const wobbleY =
    Math.cos(wobblePhase * 1.4) * 0.14 + Math.cos(wobblePhase * 3.1) * 0.05;

  x += vx + wobbleX;
  y += vy + wobbleY;

  if (x < 10 || x > 90) {
    vx = -vx * (0.85 + Math.random() * 0.3);
    x = clamp(x, 10, 90);
    erraticTimer = Math.min(erraticTimer, 4);
  }
  if (y < 10 || y > 90) {
    vy = -vy * (0.85 + Math.random() * 0.3);
    y = clamp(y, 10, 90);
    erraticTimer = Math.min(erraticTimer, 4);
  }

  return {
    ...shape,
    x,
    y,
    vx,
    vy,
    wobblePhase,
    erraticTimer,
    rotation,
  };
}

function randomSpin(vx: number, vy: number): number {
  const speed = Math.hypot(vx, vy);
  return speed * 18 + (Math.random() - 0.5) * 4;
}

export default function CaptureArena({
  shapes,
  phase,
  disabled,
  onShapeTap,
}: CaptureArenaProps) {
  const [liveShapes, setLiveShapes] = useState<ArenaShape[]>([]);
  const liveShapesRef = useRef<ArenaShape[]>([]);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    liveShapesRef.current = shapes.map((shape) => ({ ...shape }));
    setLiveShapes(liveShapesRef.current);
  }, [shapes]);

  useEffect(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (phase !== "stimulus") return;

    const hasMotion = shapes.some((shape) => shape.kind === "distractor-moving");
    if (!hasMotion) return;

    let running = true;

    const tick = () => {
      if (!running) return;

      liveShapesRef.current = liveShapesRef.current.map((shape) =>
        shape.kind === "distractor-moving" ? updateMovingShape(shape) : shape,
      );

      setLiveShapes([...liveShapesRef.current]);
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [phase, shapes]);

  return (
    <div
      className="relative h-80 w-full overflow-hidden rounded-2xl border-2 border-zinc-200 bg-white"
      style={{ touchAction: "manipulation" }}
    >
      {phase === "ready" && (
        <div className="flex h-full items-center justify-center text-zinc-500">
          Get ready…
        </div>
      )}

      {phase === "stimulus" &&
        liveShapes.map((shape) => (
          <button
            key={shape.id}
            type="button"
            disabled={disabled}
            aria-label={shape.isTarget ? "Target" : "Distractor"}
            onPointerDown={(event) => {
              event.preventDefault();
              onShapeTap(shape.id);
            }}
            className={`absolute touch-manipulation shadow-sm transition-transform active:scale-95 ${colorClassName(shape)} ${variantClassName(shape.variant)}`}
            style={shapeStyle(shape)}
          />
        ))}

      {phase === "feedback" && (
        <div className="flex h-full items-center justify-center text-zinc-500">
          Next trial…
        </div>
      )}
    </div>
  );
}
