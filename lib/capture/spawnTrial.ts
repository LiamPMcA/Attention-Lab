import { getCaptureLevel } from "@/lib/capture/levels";
import type { ArenaShape, ShapeKind } from "@/lib/types";

const SHAPE_SIZE = 56;
const MIN_DISTANCE = 18;

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function overlaps(x: number, y: number, placed: { x: number; y: number }[]): boolean {
  return placed.some((point) => {
    const dx = x - point.x;
    const dy = y - point.y;
    return Math.hypot(dx, dy) < MIN_DISTANCE;
  });
}

function randomPosition(placed: { x: number; y: number }[]): { x: number; y: number } {
  for (let attempt = 0; attempt < 40; attempt++) {
    const x = randomBetween(12, 88);
    const y = randomBetween(12, 88);
    if (!overlaps(x, y, placed)) {
      return { x, y };
    }
  }
  return { x: randomBetween(12, 88), y: randomBetween(12, 88) };
}

function createShape(
  kind: ShapeKind,
  isTarget: boolean,
  placed: { x: number; y: number }[],
): ArenaShape {
  const { x, y } = randomPosition(placed);
  placed.push({ x, y });

  const shape: ArenaShape = {
    id: crypto.randomUUID(),
    kind,
    isTarget,
    x,
    y,
    size: SHAPE_SIZE,
  };

  if (kind === "distractor-moving") {
    shape.vx = randomBetween(-0.08, 0.08) * (Math.random() > 0.5 ? 1 : -1);
    shape.vy = randomBetween(-0.08, 0.08) * (Math.random() > 0.5 ? 1 : -1);
  }

  return shape;
}

export function spawnCaptureTrial(trialIndex: number): ArenaShape[] {
  const level = getCaptureLevel(trialIndex);
  const placed: { x: number; y: number }[] = [];
  const shapes: ArenaShape[] = [];

  shapes.push(createShape("target", true, placed));

  for (let i = 0; i < level.staticRed; i++) {
    shapes.push(createShape("distractor-red-static", false, placed));
  }
  for (let i = 0; i < level.flashingRed; i++) {
    shapes.push(createShape("distractor-red-flash", false, placed));
  }
  for (let i = 0; i < level.moving; i++) {
    shapes.push(createShape("distractor-moving", false, placed));
  }
  for (let i = 0; i < level.fakeTargets; i++) {
    shapes.push(createShape("distractor-fake", false, placed));
  }

  return shapes;
}
