import { getCaptureLevel } from "@/lib/capture/levels";
import type { ArenaShape, ShapeKind, ShapeVariant } from "@/lib/types";

const SHAPE_SIZE = 56;
const MIN_DISTANCE = 18;

const DISTRACTOR_VARIANTS: ShapeVariant[] = [
  "circle",
  "square",
  "diamond",
  "triangle",
];

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}

function pickVariant(variants: ShapeVariant[]): ShapeVariant {
  return variants[randomInt(0, variants.length - 1)];
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

function assignErraticMotion(shape: ArenaShape): void {
  const angle = randomBetween(0, Math.PI * 2);
  const speed = randomBetween(0.14, 0.28);
  shape.vx = Math.cos(angle) * speed;
  shape.vy = Math.sin(angle) * speed;
  shape.wobblePhase = randomBetween(0, Math.PI * 2);
  shape.wobbleSpeed = randomBetween(0.12, 0.28);
  shape.erraticTimer = randomInt(6, 20);
}

function createShape(
  kind: ShapeKind,
  isTarget: boolean,
  placed: { x: number; y: number }[],
): ArenaShape {
  const { x, y } = randomPosition(placed);
  placed.push({ x, y });

  const variant: ShapeVariant = isTarget
    ? "circle"
    : kind === "distractor-fake"
      ? pickVariant(["circle", "square"])
      : pickVariant(DISTRACTOR_VARIANTS);

  const shape: ArenaShape = {
    id: crypto.randomUUID(),
    kind,
    variant,
    isTarget,
    x,
    y,
    size: SHAPE_SIZE,
    rotation: variant === "circle" ? 0 : randomBetween(0, 360),
  };

  if (kind === "distractor-moving") {
    assignErraticMotion(shape);
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
