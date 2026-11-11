import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import * as StringMatch from './string-match.js';
const client = fs.readFileSync(new URL('./client-source.js', import.meta.url), 'utf8');
const code = client.slice(client.indexOf('    const rowMatchers'), client.indexOf('    function QuickSwitcher('));
const context = vm.createContext({ StringMatch });
vm.runInContext(code + '\nglobalThis.match = matchesQuery; globalThis.filter = pickerRows;', context);
test('project title and full path retain separate matching semantics', () => {
  const project = {kind:'workspace',title:'MyDashboard',meta:'/projects/web/MyDashboard'};
  assert.equal(context.match(project,'Dashboard'),true); // content substring
  assert.equal(context.match({title:'MyDashboard'},'Dashboard'),false);
  assert.equal(context.match({title:'github workflow'},'gw'),true);
  assert.equal(context.match({title:'github workflow'},'gh'),false);
  assert.equal(context.match({title:'foo_bar'},'fb'),false);
  assert.equal(context.match({title:'foo-bar'},'fb'),true);
});
test('Chinese and model prefixes respect active provider filter', () => {
  const row={kind:'model',title:'工作台',model:'work-bench',provider:'example'};
  assert.equal(context.match(row,'gzt'),true);
  assert.equal(context.match(row,'工zt'),false);
  assert.equal(context.filter([row],'gzt','other').length,0);
  assert.equal(context.filter([row],'gzt','example').length,1);
});
test('no trim, normalization or keyword AND syntax is added', () => {
  assert.equal(context.match({title:'abc'},' abc'),false);
  assert.equal(context.match({title:'abc'},'Ａ'),false);
  assert.equal(context.match({title:'github workflow'},'work git'),false);
  assert.equal(context.match({title:'abc'},''),true);
});
