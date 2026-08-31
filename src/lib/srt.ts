export type SrtCue = {
  start: number;
  end: number;
  text: string;
};

export type TranscriptParagraph = {
  start: number;
  text: string;
};

const TIMECODE = /(\d+):(\d{2}):(\d{2})[,.](\d{1,3})\s*-->\s*(\d+):(\d{2}):(\d{2})[,.](\d{1,3})/;
const PARAGRAPH_MIN_LENGTH = 60;
const PARAGRAPH_MAX_CUES = 12;
/** A silence this long reads as a new thought, so it always breaks a paragraph. */
const PARAGRAPH_GAP = 2500;
const SENTENCE_ENDINGS = /[。！？…?!]["'”’)）】」』]*$/;
const CJK = /[\u3000-\u303f\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uff00-\uffef]/;

function toMilliseconds(
  hours: string,
  minutes: string,
  seconds: string,
  fraction: string,
) {
  return (
    Number(hours) * 3600000 +
    Number(minutes) * 60000 +
    Number(seconds) * 1000 +
    Number(fraction.padEnd(3, "0"))
  );
}

function cleanCueText(lines: string[]) {
  return lines
    .join(" ")
    .replace(/<\/?[a-z][^>]*>/gi, "")
    .replace(/\{\\[^}]*\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseSrt(raw: string): SrtCue[] {
  const normalized = raw.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const cues: SrtCue[] = [];

  for (const block of normalized.split(/\n{2,}/)) {
    const lines = block.split("\n").filter((line) => line.trim().length > 0);

    if (lines.length === 0) {
      continue;
    }

    const timeIndex = lines.findIndex((line) => TIMECODE.test(line));

    if (timeIndex === -1) {
      continue;
    }

    const matched = lines[timeIndex].match(TIMECODE);

    if (!matched) {
      continue;
    }

    const text = cleanCueText(lines.slice(timeIndex + 1));

    if (text.length === 0) {
      continue;
    }

    const previous = cues.at(-1);

    if (previous?.text === text) {
      previous.end = toMilliseconds(matched[5], matched[6], matched[7], matched[8]);
      continue;
    }

    cues.push({
      start: toMilliseconds(matched[1], matched[2], matched[3], matched[4]),
      end: toMilliseconds(matched[5], matched[6], matched[7], matched[8]),
      text,
    });
  }

  return cues;
}

function joinCueText(previous: string, next: string) {
  if (previous.length === 0) {
    return next;
  }

  const needsSpace = !CJK.test(previous.at(-1) ?? "") && !CJK.test(next.at(0) ?? "");

  return needsSpace ? `${previous} ${next}` : previous + next;
}

export function groupCues(cues: SrtCue[]): TranscriptParagraph[] {
  const paragraphs: TranscriptParagraph[] = [];
  let start = 0;
  let end = 0;
  let count = 0;
  let text = "";

  const flush = () => {
    if (count === 0) {
      return;
    }

    paragraphs.push({ start, text });
    count = 0;
    text = "";
  };

  for (const cue of cues) {
    if (count > 0 && cue.start - end > PARAGRAPH_GAP) {
      flush();
    }

    if (count === 0) {
      start = cue.start;
    }

    text = joinCueText(text, cue.text);
    end = cue.end;
    count += 1;

    const complete = SENTENCE_ENDINGS.test(text) && text.length >= PARAGRAPH_MIN_LENGTH;

    if (complete || count >= PARAGRAPH_MAX_CUES) {
      flush();
    }
  }

  flush();

  return paragraphs;
}

export function formatTimestamp(milliseconds: number) {
  const total = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const padded = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return hours > 0 ? `${hours}:${padded}` : padded;
}
