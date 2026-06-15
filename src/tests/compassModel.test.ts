import { describe, it, expect } from 'vitest';
import {
  toBucket,
  fromBucket,
  matters,
  lived,
  drift,
  weeksFor,
  tone,
  isTender,
  reflectionKey,
  weekDeltaKey,
  LIVED_KEY,
  MATTERS_KEY,
} from '../utils/compassModel';
import { LifeArea } from '../types/LifeArea';
import { Snapshot } from '../types/LifeCompassDocument';

// -- fixture helpers --

function makeArea(importance: number, satisfaction: number): LifeArea {
  return {
    id: 'area-1',
    name: 'Test area',
    description: '',
    details: '',
    importance,
    satisfaction,
  };
}

function makeSnapshot(
  createdAt: string,
  areaId: string,
  satisfaction: number,
): Snapshot {
  return {
    id: `snap-${createdAt}`,
    createdAt,
    areas: [
      {
        id: areaId,
        name: 'Test area',
        importance: 8,
        satisfaction,
      },
    ],
  };
}

// -- toBucket: every value 1..10 --

describe('toBucket', () => {
  it('maps 1 -> 1', () => expect(toBucket(1)).toBe(1));
  it('maps 2 -> 1', () => expect(toBucket(2)).toBe(1));
  it('maps 3 -> 2', () => expect(toBucket(3)).toBe(2));
  it('maps 4 -> 2', () => expect(toBucket(4)).toBe(2));
  it('maps 5 -> 3', () => expect(toBucket(5)).toBe(3));
  it('maps 6 -> 3', () => expect(toBucket(6)).toBe(3));
  it('maps 7 -> 4', () => expect(toBucket(7)).toBe(4));
  it('maps 8 -> 4', () => expect(toBucket(8)).toBe(4));
  it('maps 9 -> 5', () => expect(toBucket(9)).toBe(5));
  it('maps 10 -> 5', () => expect(toBucket(10)).toBe(5));

  it('clamps values below 1', () => expect(toBucket(0)).toBe(1));
  it('clamps values above 10', () => expect(toBucket(12)).toBe(5));
});

// -- fromBucket --

describe('fromBucket', () => {
  it('maps bucket 1 -> 2', () => expect(fromBucket(1)).toBe(2));
  it('maps bucket 2 -> 4', () => expect(fromBucket(2)).toBe(4));
  it('maps bucket 3 -> 6', () => expect(fromBucket(3)).toBe(6));
  it('maps bucket 4 -> 8', () => expect(fromBucket(4)).toBe(8));
  it('maps bucket 5 -> 10', () => expect(fromBucket(5)).toBe(10));
});

// -- matters and lived --

describe('matters', () => {
  it('returns the bucketed importance', () => {
    expect(matters(makeArea(8, 4))).toBe(4);
  });
});

describe('lived', () => {
  it('returns the bucketed satisfaction', () => {
    expect(lived(makeArea(8, 4))).toBe(2);
  });
});

// -- drift --

describe('drift', () => {
  it('is 0 when lived equals matters', () => {
    // importance 8 -> bucket 4, satisfaction 8 -> bucket 4
    expect(drift(makeArea(8, 8))).toBe(0);
  });

  it('is 0 when lived exceeds matters', () => {
    // importance 4 -> bucket 2, satisfaction 10 -> bucket 5
    expect(drift(makeArea(4, 10))).toBe(0);
  });

  it('is positive when matters exceeds lived', () => {
    // importance 10 -> bucket 5, satisfaction 2 -> bucket 1
    expect(drift(makeArea(10, 2))).toBe(4);
  });

  it('returns the exact gap in bucket units', () => {
    // importance 8 -> bucket 4, satisfaction 4 -> bucket 2
    expect(drift(makeArea(8, 4))).toBe(2);
  });
});

// -- weeksFor --

describe('weeksFor', () => {
  const areaId = 'area-1';
  const area = makeArea(8, 6); // lived bucket = 3

  it('returns [lived] when history is empty', () => {
    expect(weeksFor(area, [])).toEqual([3]);
  });

  it('returns [lived] when no snapshot contains this area', () => {
    const snap = makeSnapshot('2025-01-01T00:00:00Z', 'other-area', 4);
    expect(weeksFor(area, [snap])).toEqual([3]);
  });

  it('appends current lived value after matched snapshots', () => {
    const s1 = makeSnapshot('2025-01-01T00:00:00Z', areaId, 4); // bucket 2
    const s2 = makeSnapshot('2025-02-01T00:00:00Z', areaId, 6); // bucket 3
    // current satisfaction = 6 -> bucket 3
    expect(weeksFor(area, [s1, s2])).toEqual([2, 3, 3]);
  });

  it('sorts snapshots by createdAt ascending regardless of input order', () => {
    const older = makeSnapshot('2025-01-01T00:00:00Z', areaId, 4); // bucket 2
    const newer = makeSnapshot('2025-03-01T00:00:00Z', areaId, 8); // bucket 4
    // pass newer first intentionally
    expect(weeksFor(area, [newer, older])).toEqual([2, 4, 3]);
  });

  it('ignores snapshots that do not contain the area', () => {
    const relevant = makeSnapshot('2025-01-15T00:00:00Z', areaId, 10); // bucket 5
    const irrelevant = makeSnapshot('2025-01-10T00:00:00Z', 'other', 2);
    expect(weeksFor(area, [irrelevant, relevant])).toEqual([5, 3]);
  });
});

// -- tone --

describe('tone', () => {
  it('returns sage when lived >= 4', () => {
    // satisfaction 8 -> bucket 4
    expect(tone(makeArea(6, 8))).toBe('sage');
  });

  it('returns sage when lived === 5', () => {
    expect(tone(makeArea(6, 10))).toBe('sage');
  });

  it('returns clay when lived <= 2', () => {
    // satisfaction 2 -> bucket 1
    expect(tone(makeArea(6, 2))).toBe('clay');
  });

  it('returns clay when lived === 2', () => {
    // satisfaction 4 -> bucket 2
    expect(tone(makeArea(6, 4))).toBe('clay');
  });

  it('returns muted when lived === 3', () => {
    // satisfaction 6 -> bucket 3
    expect(tone(makeArea(6, 6))).toBe('muted');
  });
});

// -- isTender --

describe('isTender', () => {
  it('is true when lived <= 2 and matters >= 4', () => {
    // importance 8 -> bucket 4, satisfaction 2 -> bucket 1
    expect(isTender(makeArea(8, 2))).toBe(true);
  });

  it('is false when lived is 3 even if matters is high', () => {
    expect(isTender(makeArea(10, 6))).toBe(false);
  });

  it('is false when matters is 3 even if lived is low', () => {
    // importance 6 -> bucket 3
    expect(isTender(makeArea(6, 2))).toBe(false);
  });

  it('is false when both are in the middle', () => {
    expect(isTender(makeArea(6, 6))).toBe(false);
  });

  it('is true at the boundary (matters===4, lived===2)', () => {
    // importance 8 -> bucket 4, satisfaction 4 -> bucket 2
    expect(isTender(makeArea(8, 4))).toBe(true);
  });
});

// -- reflectionKey --

describe('reflectionKey', () => {
  it('returns far_off when matters>=4 and lived<=2', () => {
    // importance 8 -> 4, satisfaction 2 -> 1
    expect(reflectionKey(makeArea(8, 2))).toBe('far_off');
  });

  it('returns far_off boundary (matters===4, lived===2)', () => {
    expect(reflectionKey(makeArea(8, 4))).toBe('far_off');
  });

  it('returns close when matters>=4 and lived>=4', () => {
    // importance 8 -> 4, satisfaction 8 -> 4
    expect(reflectionKey(makeArea(8, 8))).toBe('close');
  });

  it('returns close boundary (matters===4, lived===4)', () => {
    expect(reflectionKey(makeArea(8, 8))).toBe('close');
  });

  it('returns aligned when drift===0 and matters < 4', () => {
    // importance 4 -> 2, satisfaction 4 -> 2: drift = 0
    expect(reflectionKey(makeArea(4, 4))).toBe('aligned');
  });

  it('returns aligned when lived exceeds matters', () => {
    // importance 4 -> 2, satisfaction 10 -> 5: drift = 0
    expect(reflectionKey(makeArea(4, 10))).toBe('aligned');
  });

  it('returns small_distance for a small gap with low matters', () => {
    // importance 5 -> 3, satisfaction 3 -> 2: drift = 1, matters < 4
    expect(reflectionKey(makeArea(5, 3))).toBe('small_distance');
  });
});

// -- weekDeltaKey --

describe('weekDeltaKey', () => {
  const areaId = 'area-1';

  it('returns new when there is no history', () => {
    const area = makeArea(8, 6);
    expect(weekDeltaKey(area, [])).toBe('new');
  });

  it('returns new when no snapshot matches the area', () => {
    const area = makeArea(8, 6);
    const snap = makeSnapshot('2025-01-01T00:00:00Z', 'other', 4);
    expect(weekDeltaKey(area, [snap])).toBe('new');
  });

  it('returns closer when latest bucket > previous', () => {
    // snap: satisfaction 4 -> bucket 2; current satisfaction 8 -> bucket 4
    const area = makeArea(8, 8);
    const snap = makeSnapshot('2025-01-01T00:00:00Z', areaId, 4);
    expect(weekDeltaKey(area, [snap])).toBe('closer');
  });

  it('returns same when latest bucket === previous', () => {
    // snap: satisfaction 8 -> bucket 4; current satisfaction 8 -> bucket 4
    const area = makeArea(8, 8);
    const snap = makeSnapshot('2025-01-01T00:00:00Z', areaId, 8);
    expect(weekDeltaKey(area, [snap])).toBe('same');
  });

  it('returns further when latest bucket < previous', () => {
    // snap: satisfaction 8 -> bucket 4; current satisfaction 4 -> bucket 2
    const area = makeArea(8, 4);
    const snap = makeSnapshot('2025-01-01T00:00:00Z', areaId, 8);
    expect(weekDeltaKey(area, [snap])).toBe('further');
  });

  it('compares only the last two points in a longer series', () => {
    // three snapshots -> [bucket2, bucket3, bucket4] + current bucket2 -> further
    const area = makeArea(8, 4); // current lived = 2
    const s1 = makeSnapshot('2025-01-01T00:00:00Z', areaId, 4); // bucket 2
    const s2 = makeSnapshot('2025-02-01T00:00:00Z', areaId, 6); // bucket 3
    const s3 = makeSnapshot('2025-03-01T00:00:00Z', areaId, 8); // bucket 4
    // weeksFor = [2, 3, 4, 2]; at(-1)=2 < at(-2)=4 -> further
    expect(weekDeltaKey(area, [s1, s2, s3])).toBe('further');
  });
});

// -- i18n key helpers --

describe('LIVED_KEY', () => {
  it('returns the correct key for each bucket', () => {
    expect(LIVED_KEY(1)).toBe('your_compass.scale.lived.1');
    expect(LIVED_KEY(3)).toBe('your_compass.scale.lived.3');
    expect(LIVED_KEY(5)).toBe('your_compass.scale.lived.5');
  });
});

describe('MATTERS_KEY', () => {
  it('returns the correct key for each bucket', () => {
    expect(MATTERS_KEY(1)).toBe('your_compass.scale.matters.1');
    expect(MATTERS_KEY(3)).toBe('your_compass.scale.matters.3');
    expect(MATTERS_KEY(5)).toBe('your_compass.scale.matters.5');
  });
});
