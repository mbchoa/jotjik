import { formatTime } from './formatTime';
import { describe, it, expect } from 'vitest';

describe('formatTime', () => {
  it('should format time without milliseconds by default', () => {
    // 1 hour, 30 minutes, 45 seconds = 5445000ms
    const result = formatTime(5445000);
    expect(result).toEqual({
      hh: '1',
      mm: '30',
      ss: '45'
    });
  });

  it('should format time with milliseconds when showMs is true', () => {
    // 1 hour, 30 minutes, 45.67 seconds = 5445670ms
    const result = formatTime(5445670, true);
    expect(result).toEqual({
      hh: '1',
      mm: '30',
      ss: '45',
      ms: '67'
    });
  });

  it('should handle zero time', () => {
    const result = formatTime(0);
    expect(result).toEqual({
      hh: '0',
      mm: '0',
      ss: '0'
    });
  });

  it('should handle time less than a second', () => {
    const result = formatTime(500, true);
    expect(result).toEqual({
      hh: '0',
      mm: '0',
      ss: '0',
      ms: '50'
    });
  });
});
