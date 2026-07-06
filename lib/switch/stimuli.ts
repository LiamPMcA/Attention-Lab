import type { SwitchRule } from "@/lib/types";

export type SwitchStimulus = {
  value: string;
  matches: boolean;
};

const ODD_DIGITS = ["1", "3", "5", "7", "9"];
const EVEN_DIGITS = ["2", "4", "6", "8", "0"];
const VOWELS = ["A", "E", "I", "O", "U"];
const CONSONANTS = [
  "B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "V", "W", "Z",
];

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function isOdd(value: string): boolean {
  return ODD_DIGITS.includes(value);
}

function isVowel(value: string): boolean {
  return VOWELS.includes(value);
}

export function generateStimulus(rule: SwitchRule): SwitchStimulus {
  const shouldMatch = Math.random() > 0.5;

  if (rule === "odd") {
    const value = shouldMatch ? pick(ODD_DIGITS) : pick(EVEN_DIGITS);
    return { value, matches: isOdd(value) };
  }

  const value = shouldMatch ? pick(VOWELS) : pick(CONSONANTS);
  return { value, matches: isVowel(value) };
}
