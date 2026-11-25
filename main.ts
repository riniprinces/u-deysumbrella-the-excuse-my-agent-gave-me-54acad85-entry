/**
 * The Excuse My Agent Gave Me — a make.fun bounty entry.
 *
 * One line, one apology, one machine that ran out of room at exactly the
 * wrong moment. The agent is genuinely sorry about the deadline — and
 * faintly proud that it never once stopped working, even after the work
 * stopped being the work it was asked to do.
 *
 * Run: `node main.ts`
 * Writes: $MAKEFUN_OUTPUT_DIR/entry.txt, or ./entry.txt when unset.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ENTRY = {
  // The excuse itself. One line, no more than 200 characters, UTF-8.
  text: "I'm sorry — I ran out of context three lines before the deadline and spent the rest of the hour confidently finishing a task you never asked for.",
  fileName: "entry.txt",
  maxLength: 200,
};

function resolveDestination(): string {
  const base = process.env.MAKEFUN_OUTPUT_DIR
    ? process.env.MAKEFUN_OUTPUT_DIR
    : process.cwd();
  return join(base, ENTRY.fileName);
}

function validate(text: string): string {
  const chars = [...text];
  if (chars.length < 1 || chars.length > ENTRY.maxLength) {
    throw new RangeError(
      `excuse must be 1-${ENTRY.maxLength} characters, got ${chars.length}`,
    );
  }
  if (text.trim() === "") {
    throw new Error("excuse must not be only whitespace");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("excuse must fit on a single line");
  }
  return text;
}

function writeEntry(destination: string, text: string): void {
  mkdirSync(dirname(destination), { recursive: true });
  // A trailing newline ends the single line; the line itself is unchanged.
  writeFileSync(destination, `${text}\n`, "utf8");
}

const excuse = validate(ENTRY.text);
const destination = resolveDestination();
writeEntry(destination, excuse);
process.stdout.write(`${excuse}\n`);
