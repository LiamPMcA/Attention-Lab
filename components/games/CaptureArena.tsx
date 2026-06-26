"use client";

import { useEffect, useRef, useState } from "react";
import type { ArenaShape, TrialPhase } from "@/lib/types";

type CaptureArenaProps = {
  shapes: ArenaShape[];
  phase: TrialPhase;
  disabled: boolean;
  onShapeTap: (shapeId: string) => void;
};

function shapeClassName(shape: ArenaShape): string {
  const base =
    "absolute rounded-full touch-manipulation shadow-sm transition-transform active:scale-95";

  switch (shape.kind) {
    case "target":
      return `${base} bg-blue-600 ring-2 ring-blue-900/20`;
    case "distractor-fake":
      return `${base} bg-blue-400 ring-2 ring-dashed ring-white/90`;
    case "distractor-red-static":
      return `${base} bg-red-500`;
    case "distractor-red-flash":
      return `${base} animate-pulse bg-red-500`;
    case "distractor-moving":
      return `${base} bg-orange-500`;
    default:
      return base;
  }
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

      liveShapesRef.current = liveShapesRef.current.map((shape) => {
        if (shape.kind !== "distractor-moving" || shape.vx === undefined) {
          return shape;
        }

        let x = shape.x + shape.vx;
        let y = shape.y + (shape.vy ?? 0);
        let vx = shape.vx;
        let vy = shape.vy ?? 0;

        if (x < 10 || x > 90) {
          vx = -vx;
          x = Math.min(90, Math.max(10, x));
        }
        if (y < 10 || y > 90) {
          vy = -vy;
          y = Math.min(90, Math.max(10, y));
        }

        return { ...shape, x, y, vx, vy };
      });

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
      className="relative h-80 w-full overflow-hidden rounded-2xl border-2 border-zinc-200 bg-zinc-100"
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
            className={shapeClassName(shape)}
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: shape.size,
              height: shape.size,
              transform: "translate(-50%, -50%)",
            }}
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
