import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { genStringMatchFn, genChineseMatchFn, genContentMatchFn } from './string-match.js';

const range = (start, end = start) => ({ start, end });
const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// The historical nested optional-RegExp algorithm, intentionally only exercised
// on small non-surrogate inputs. Captures preserve its full highlight behavior.
function reference(sentence, keyword) {
  const groups = sentence.split(/(\w+|[\u4E00-\u9FA5])/g);
  const source = groups.map((group, index) => {
    let inner = '';
    if (index % 2) {
      for (let i = group.length - 1; i >= 0; i--) inner = `(?:${escape(group[i])}${inner})?`;
    } else {
      for (let i = 0; i < group.length; i++) inner += `${escape(group[i])}?`;
    }
    return `(${inner})`;
  }).join('');
  const matched = new RegExp(`^${source}$`, 'i').exec(keyword);
  if (!matched) return null;
  let offset = 0;
  const result = [];
  for (let i = 0; i < groups.length; i++) {
    if (matched[i + 1].length) result.push(range(offset, offset + matched[i + 1].length - 1));
    offset += groups[i].length;
  }
  return result;
}

test('public exports and empty keywords', () => {
  for (const factory of [genStringMatchFn, genChineseMatchFn, genContentMatchFn]) {
    assert.equal(typeof factory, 'function');
    assert.equal(typeof factory(''), 'function');
    assert.equal(factory('')('a'), null);
  }
  assert.deepEqual(genStringMatchFn('anything')(''), []);
  assert.deepEqual(genChineseMatchFn('工作台')(''), []);
  assert.equal(genContentMatchFn('anything')(''), null);
});

test('all requested word, underscore, hyphen and camelcase examples', () => {
  const examples = [
    ['github workflow', ['git', 'work', 'gw', 'giwo'], ['hub', 'gh', 'wf']],
    ['MyComponent', ['myc'], ['mc', 'component']],
    ['foo_bar', ['foo_b'], ['fb']],
    ['foo-bar', ['fb', 'f-b'], []],
  ];
  for (const [sentence, yes, no] of examples) {
    const match = genStringMatchFn(sentence);
    for (const keyword of yes) assert.deepEqual(match(keyword), reference(sentence, keyword), `${sentence}: ${keyword}`);
    for (const keyword of no) assert.equal(match(keyword), null, `${sentence}: ${keyword}`);
  }
  assert.deepEqual(genStringMatchFn('github workflow')('giwo'), [range(0, 1), range(7, 8)]);
  assert.deepEqual(genStringMatchFn('foo-bar')('f-b'), [range(0), range(3), range(4)]);
  assert.deepEqual(genStringMatchFn('foo_bar')('foo_b'), [range(0, 4)]);
});

test('separator highlights use group start plus consumed count, not positions', () => {
  const match = genStringMatchFn('a--- :b');
  assert.deepEqual(match(':b'), [range(1), range(6)]);
  assert.deepEqual(match(' :b'), [range(1, 2), range(6)]);
  assert.deepEqual(genStringMatchFn('--a')('-a'), [range(0), range(2)]);
  assert.deepEqual(genStringMatchFn('a--b')('a'), [range(0)]);
  assert.deepEqual(genStringMatchFn('a--b')('b'), [range(3)]);
});

test('consume-first greedy, backtracking DP ambiguity, and necessary failures', () => {
  assert.deepEqual(genStringMatchFn('ax ab')('ab'), [range(3, 4)]);
  assert.deepEqual(genStringMatchFn('ax ab ac')('ac'), [range(6, 7)]);
  assert.deepEqual(genStringMatchFn('ax ab ac')('aab'), [range(0), range(3, 4)]);
  assert.deepEqual(genStringMatchFn('ax ab ab')('ab'), [range(3, 4)]);
  assert.deepEqual(genStringMatchFn('a a a')('aa'), [range(0), range(2)]);
  assert.equal(genStringMatchFn('abc')('ac'), null); // subsequence exists, prefix does not
  assert.equal(genStringMatchFn('ax ab')('ac'), null); // fails necessary condition
  assert.equal(genStringMatchFn('abc')('abcd'), null);
});

test('non-/u ignoreCase Canonicalize without trim, scoring or normalization', () => {
  const pairs = [['é', 'É', true], ['σ', 'ς', true], ['ß', 'ẞ', false], ['ß', 'ss', false],
    ['K', 'k', false], ['ſ', 's', false], ['İ', 'i', false], ['ı', 'I', false],
    ['Ｋ', 'k', false], ['e\u0301', 'é', false]];
  for (const [sentence, keyword, accepted] of pairs) {
    assert.equal(genStringMatchFn(sentence)(keyword) !== null, accepted, `${sentence}/${keyword}`);
    assert.deepEqual(genStringMatchFn(sentence)(keyword), reference(sentence, keyword));
  }
  assert.deepEqual(genStringMatchFn('ABC')('abc'), [range(0, 2)]);
  assert.equal(genStringMatchFn('abc')(' abc'), null);
  assert.equal(genStringMatchFn('abc')('abc '), null);
});

test('Unicode separators and naturally optional surrogate units use UTF-16', () => {
  assert.deepEqual(genStringMatchFn('😀foo')('f'), [range(2)]);
  assert.deepEqual(genStringMatchFn('😀foo')('😀f'), [range(0, 1), range(2)]);
  assert.deepEqual(genStringMatchFn('😀foo')('\ud83df'), [range(0), range(2)]);
  assert.deepEqual(genStringMatchFn('😀foo')('\ude00f'), [range(0), range(2)]);
  assert.deepEqual(genStringMatchFn('😀foo')('\ude00'), [range(0)]);
  assert.deepEqual(genStringMatchFn('甲\n\t。乙')('。乙'), [range(1), range(4)]);
  assert.deepEqual(genStringMatchFn('𐐨')('𐐀'), null); // no /u astral case folding
});

test('Chinese requested pinyin and original-only examples with complete highlights', () => {
  const match = genChineseMatchFn('工作台');
  const expected = {
    gzt: [range(0), range(1), range(2)],
    gongzuotai: [range(0), range(1), range(2)],
    gongzt: [range(0), range(1), range(2)],
    zuo: [range(1)],
    工作台: [range(0), range(1), range(2)],
    作: [range(1)],
    工台: [range(0), range(2)],
  };
  for (const [keyword, highlights] of Object.entries(expected)) assert.deepEqual(match(keyword), highlights, keyword);
  for (const keyword of ['工zt', 'gz台']) assert.equal(match(keyword), null, keyword);
});

test('pinyin v, contextual contiguous runs, boundaries and repeated highlights', () => {
  assert.deepEqual(genChineseMatchFn('女绿')('nvlv'), [range(0), range(1)]);
  assert.deepEqual(genChineseMatchFn('重庆')('chongqing'), [range(0), range(1)]);
  assert.equal(genChineseMatchFn('a工作台b')('agztb'), null); // no artificial ASCII/run boundary
  assert.deepEqual(genChineseMatchFn('a工作台b')('agongztaib'), [range(0, 1), range(2), range(3, 4)]);
  assert.deepEqual(genChineseMatchFn('工作台')('gong`zuo'), [range(0), range(0), range(1)]);
  assert.deepEqual(genChineseMatchFn('工作台')('`'), [range(0)]);
  assert.deepEqual(genChineseMatchFn('😀工作台')('gzt'), [range(2), range(3), range(4)]);
  assert.deepEqual(genChineseMatchFn('工作工作')('gzgz'), [range(0), range(1), range(2), range(3)]);
});

test('content literal all occurrences, nonoverlap, escaping and latest cache reset', () => {
  const match = genContentMatchFn('a.b A.B aab a.b');
  const expected = [range(0, 2), range(4, 6), range(12, 14)];
  assert.deepEqual(match('a.b'), expected);
  assert.deepEqual(match('a.b'), expected);
  assert.deepEqual(match('aab'), [range(8, 10)]);
  assert.deepEqual(match('a.b'), expected);
  assert.equal(match(''), null);
  assert.deepEqual(match('a.b'), expected);
  assert.deepEqual(genContentMatchFn('aaaaa')('aa'), [range(0, 1), range(2, 3)]);
  for (const keyword of ['.', '*', '+', '?', '^', '$', '{', '}', '(', ')', '|', '[', ']', '\\']) {
    assert.deepEqual(genContentMatchFn(`x${keyword}x${keyword}`)(keyword), [range(1), range(3)], keyword);
  }
  assert.deepEqual(genContentMatchFn('😀😀')('😀'), [range(0, 1), range(2, 3)]);
});

test('content prefers literal substring over prefix/pinyin fallback', () => {
  assert.deepEqual(genContentMatchFn('github workflow')('hub'), [range(3, 5)]);
  assert.deepEqual(genContentMatchFn('工作台 工作台')('工作台'), [range(0, 2), range(4, 6)]);
  assert.deepEqual(genContentMatchFn('工作台')('gzt'), [range(0), range(1), range(2)]);
  assert.deepEqual(genContentMatchFn('工作台')('gong`zuo'), [range(0), range(0), range(1)]);
  assert.equal(genContentMatchFn('工作台')('工zt'), null);
});

test('seeded small-input differential preserves all highlight ranges', () => {
  let seed = 0x5eed1234;
  const random = (n) => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return (seed >>> 0) % n;
  };
  const alphabet = ['a', 'b', 'A', '_', '-', ' ', ':', '工', '作', 'é', 'É', 'σ', 'ς', 'ß', 'ſ', 'K'];
  for (let trial = 0; trial < 3000; trial++) {
    let sentence = '';
    let keyword = '';
    for (let i = random(10); i > 0; i--) sentence += alphabet[random(alphabet.length)];
    if (random(2)) {
      for (let i = 0; i < sentence.length; i++) if (random(2)) keyword += sentence[i];
    } else {
      for (let i = random(7); i > 0; i--) keyword += alphabet[random(alphabet.length)];
    }
    assert.deepEqual(genStringMatchFn(sentence)(keyword), reference(sentence, keyword), JSON.stringify({ trial, sentence, keyword }));
  }
});

for (const scenario of ['long-word', 'necessary-rejection', 'dp-success', 'dp-failure', 'many-separators', 'long-chinese']) {
  test(`extreme ${scenario} finishes in isolated process within 5000ms`, () => {
    const child = spawnSync(process.execPath, [new URL('./matcher-extreme.mjs', import.meta.url).pathname, scenario], {
      timeout: 5000,
      encoding: 'utf8',
    });
    assert.equal(child.error, undefined, child.error?.message);
    assert.equal(child.signal, null, child.stderr);
    assert.equal(child.status, 0, child.stderr || child.stdout);
  });
}
