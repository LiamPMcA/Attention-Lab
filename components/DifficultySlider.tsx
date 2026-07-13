import {
  DIFFICULTY_OPTIONS,
  type DifficultyLevel,
} from "@/lib/difficulty";

type DifficultySliderProps = {
  value: DifficultyLevel;
  onChange: (value: DifficultyLevel) => void;
};

export default function DifficultySlider({
  value,
  onChange,
}: DifficultySliderProps) {
  const option = DIFFICULTY_OPTIONS[value - 1];

  return (
    <div className="mb-10 w-full max-w-md">
      <div className="mb-3 flex items-center justify-between gap-4">
        <label
          htmlFor="difficulty"
          className="text-sm font-medium text-warm-muted"
        >
          Difficulty
        </label>
        <span className="text-sm font-semibold text-warm-dark">
          {option.label}
        </span>
      </div>

      <input
        id="difficulty"
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value) as DifficultyLevel)
        }
        className="difficulty-slider w-full"
      />

      <div className="mt-2 flex justify-between text-xs text-warm-tan">
        <span>Relaxed</span>
        <span>Intense</span>
      </div>

      <p className="mt-3 text-sm leading-6 text-warm-muted">
        {option.description}
      </p>
    </div>
  );
}
