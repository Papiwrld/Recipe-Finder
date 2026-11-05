// Source data often numbers its own steps, either on a separate line ("STEP 1")
// or inline ("1. Heat the oil"). The UI adds its own numbers, so remove these.
const LABEL_ONLY = /^(step\s*)?\d+\s*[.:)\-–—]?$/i;
const LEADING_LABEL = /^(step\s*\d+\s*[.:)\-–—]?|\d+\s*[.:)\-–—])\s+/i;

export function cleanSteps(instructions: string[]): string[] {
  return instructions
    .map((step) => step.trim())
    .filter((step) => step && !LABEL_ONLY.test(step))
    .map((step) => step.replace(LEADING_LABEL, ''))
    .filter(Boolean);
}
