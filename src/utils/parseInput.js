/**
 * Parses raw textarea input into an array of non-empty, trimmed strings.
 * Each line becomes one code item.
 * @param {string} raw
 * @returns {string[]}
 */
export function parseInput(raw) {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
