import { pinyin } from 'pinyin-pro';

/** @typedef {{ start: number, end: number }} MatchStatus Inclusive UTF-16 offsets. */

// ECMA-262 Canonicalize for an ignoreCase, non-Unicode RegExp. In particular,
// expansions (ß -> SS) and non-ASCII -> ASCII folds (ſ -> S) are not accepted.
function canonicalize(unit) {
  const upper = unit.toUpperCase();
  if (upper.length !== 1 || (unit.charCodeAt(0) >= 128 && upper.charCodeAt(0) < 128)) return unit;
  return upper;
}

function normalize(text) {
  const units = new Array(text.length);
  for (let i = 0; i < text.length; i++) units[i] = canonicalize(text[i]);
  return units;
}

/**
 * Words may contribute a contiguous prefix, or be skipped altogether.
 * Separator groups may contribute any of their UTF-16 units independently.
 * Surrogate units are naturally optional: this module intentionally does not
 * reproduce the old nested-RegExp emoji quantifier bug.
 * @param {string} sentence
 * @returns {(keyword: string) => MatchStatus[] | null}
 */
export function genStringMatchFn(sentence) {
  const groups = sentence.split(/(\w+|[\u4E00-\u9FA5])/g);
  const chars = normalize(sentence);
  const skips = new Uint32Array(sentence.length);
  const owners = new Uint32Array(sentence.length);
  const starts = new Uint32Array(groups.length);
  let offset = 0;
  for (let group = 0; group < groups.length; group++) {
    starts[group] = offset;
    const end = offset + groups[group].length;
    for (let i = offset; i < end; i++) {
      skips[i] = group % 2 === 1 ? end : i + 1;
      owners[i] = group;
    }
    offset = end;
  }

  function highlights(counts) {
    const result = [];
    for (let group = 0; group < counts.length; group++) {
      if (counts[group]) result.push({ start: starts[group], end: starts[group] + counts[group] - 1 });
    }
    return result;
  }

  return (keyword) => {
    const wanted = normalize(keyword);
    const length = chars.length;
    const size = wanted.length;
    if (!size) return [];
    if (size > length) return null;

    // Most queries never need a state table. This is also the consume-first
    // reconstruction when its greedy path succeeds.
    let counts = new Uint32Array(groups.length);
    let i = 0;
    let k = 0;
    while (i < length && k < size) {
      if (chars[i] === wanted[k]) {
        counts[owners[i]]++;
        i++;
        k++;
      } else {
        i = skips[i];
      }
    }
    if (k === size) return highlights(counts);

    // Ignoring prefix restrictions gives a necessary subsequence condition.
    // Reject impossible queries in linear time before allocating O(LK) memory.
    k = 0;
    for (i = 0; i < length && k < size; i++) {
      if (chars[i] === wanted[k]) k++;
    }
    if (k !== size) return null;

    // reachable[i, k]: the remaining keyword can match from sentence unit i.
    // Every transition goes to a larger i, so bottom-up evaluation is iterative.
    const width = size + 1;
    const reachable = new Uint8Array((length + 1) * width);
    reachable[length * width + size] = 1;
    for (i = length - 1; i >= 0; i--) {
      const row = i * width;
      const consumed = (i + 1) * width;
      const skipped = skips[i] * width;
      reachable[row + size] = 1; // Finishing the keyword may skip all the rest.
      for (k = size - 1; k >= 0; k--) {
        reachable[row + k] = (chars[i] === wanted[k] && reachable[consumed + k + 1]) || reachable[skipped + k];
      }
    }
    if (!reachable[0]) return null;
    counts = new Uint32Array(groups.length);
    i = 0;
    k = 0;
    while (k < size) {
      if (chars[i] === wanted[k] && reachable[(i + 1) * width + k + 1]) {
        counts[owners[i]]++;
        i++;
        k++;
      } else {
        i = skips[i];
      }
    }
    return highlights(counts);
  };
}

/** Match the whole pinyin representation first, then the original (never mixed). */
export function genChineseMatchFn(sentence) {
  const chunks = [];
  const originalIndices = [];
  const runs = sentence.split(/([\u4E00-\u9FA5]+)/g);
  let originalOffset = 0;
  for (let run = 0; run < runs.length; run++) {
    const text = runs[run];
    if (run % 2 === 0) {
      chunks.push(text);
      for (let i = 0; i < text.length; i++) originalIndices.push(originalOffset + i);
    } else {
      const syllables = pinyin(text, { type: 'array', toneType: 'none', removeNonZh: true });
      for (let char = 0; char < syllables.length; char++) {
        if (char) {
          chunks.push('`');
          originalIndices.push(originalOffset + char - 1);
        }
        const letters = syllables[char].replace(/ü/g, 'v');
        chunks.push(letters);
        for (let i = 0; i < letters.length; i++) originalIndices.push(originalOffset + char);
      }
    }
    originalOffset += text.length;
  }
  const matchPinyin = genStringMatchFn(chunks.join(''));
  const matchOriginal = genStringMatchFn(sentence);
  return (keyword) => {
    const matched = matchPinyin(keyword);
    if (matched === null) return matchOriginal(keyword);
    return matched.map((range) => ({
      start: originalIndices[range.start],
      end: originalIndices[range.end],
    }));
  };
}

/** Literal, non-overlapping content matches; only then lazy pinyin matching. */
export function genContentMatchFn(sentence) {
  let latestKeyword;
  let literal;
  let matchChinese;
  return (keyword) => {
    if (!keyword.length) return null;
    if (keyword !== latestKeyword) {
      latestKeyword = keyword;
      literal = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    }
    literal.lastIndex = 0;
    const result = [];
    let matched;
    while ((matched = literal.exec(sentence)) !== null) {
      result.push({ start: matched.index, end: matched.index + matched[0].length - 1 });
    }
    if (result.length) return result;
    matchChinese ??= genChineseMatchFn(sentence);
    return matchChinese(keyword);
  };
}
