import { describe, it, expect } from 'vitest';
import { slugify, formatUpdated } from '../src/lib/text';

describe('slugify', () => {
  it('lowercases and hyphenates plain text', () => {
    expect(slugify('Quick Answer Box')).toBe('quick-answer-box');
  });

  it('strips punctuation and collapses separators', () => {
    expect(slugify('Do You Need a Car in Portugal?')).toBe('do-you-need-a-car-in-portugal');
    expect(slugify('A1 / A2 & A12 tolls')).toBe('a1-a2-a12-tolls');
  });

  it('folds accented Portuguese characters to ASCII', () => {
    expect(slugify('Óbidos, Nazaré & São Jorge')).toBe('obidos-nazare-sao-jorge');
  });

  it('trims leading and trailing separators', () => {
    expect(slugify('  — Leaving the airport —  ')).toBe('leaving-the-airport');
  });

  it('returns an empty string for empty-ish input', () => {
    expect(slugify('')).toBe('');
    expect(slugify('   ')).toBe('');
  });
});

describe('formatUpdated', () => {
  it('formats an ISO date string as "Month YYYY"', () => {
    expect(formatUpdated('2026-08-15')).toBe('August 2026');
  });

  it('accepts a Date object', () => {
    expect(formatUpdated(new Date('2026-01-03T12:00:00Z'))).toBe('January 2026');
  });

  it('is stable regardless of local timezone (uses UTC)', () => {
    // 2026-03-01T00:00Z would roll back to Feb 28 in negative offsets if not UTC-safe
    expect(formatUpdated('2026-03-01')).toBe('March 2026');
  });
});
