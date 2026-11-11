import assert from 'node:assert/strict';
import { genStringMatchFn, genChineseMatchFn, genContentMatchFn } from './string-match.js';

// Run by string-match.test.mjs in independent children with a 5000ms timeout.
// These are correctness/time-bound guards, not benchmark deliverables.
const range = (start, end = start) => ({ start, end });
switch (process.argv[2]) {
  case 'long-word': {
    const sentence = 'a'.repeat(20000);
    const match = genStringMatchFn(sentence);
    assert.deepEqual(match(sentence), [range(0, 19999)]);
    assert.deepEqual(match('a'), [range(0)]);
    assert.equal(match(`${sentence}b`), null);
    assert.deepEqual(genContentMatchFn(sentence)('a'.repeat(10000)), [range(0, 9999), range(10000, 19999)]);
    break;
  }
  case 'necessary-rejection': {
    const sentence = 'a '.repeat(20000);
    assert.equal(genStringMatchFn(sentence)(`${'a'.repeat(10000)}z`), null);
    break;
  }
  case 'dp-success': {
    const sentence = 'ax '.repeat(1000) + 'ab';
    const actual = genStringMatchFn(sentence)(`${'a'.repeat(500)}b`);
    const expected = Array.from({ length: 499 }, (_, i) => range(i * 3));
    expected.push(range(3000, 3001));
    assert.deepEqual(actual, expected);
    break;
  }
  case 'dp-failure': {
    assert.equal(genStringMatchFn('ab '.repeat(1000))('a'.repeat(200) + 'b'.repeat(200)), null);
    break;
  }
  case 'many-separators': {
    const match = genStringMatchFn('😀-'.repeat(20000) + 'final');
    assert.deepEqual(match('f'), [range(60000)]);
    assert.deepEqual(match('-f'), [range(0), range(60000)]);
    break;
  }
  case 'long-chinese': {
    const sentence = '工'.repeat(20000);
    const match = genChineseMatchFn(sentence);
    assert.deepEqual(match('g'), [range(0)]);
    assert.deepEqual(match('工'), [range(0)]);
    assert.equal(match('notthere'), null);
    break;
  }
  default:
    throw new Error(`Unknown extreme scenario: ${process.argv[2]}`);
}
