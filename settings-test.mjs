import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
const client = fs.readFileSync(new URL('./client.js', import.meta.url), 'utf8');
const helpers = client.slice(client.indexOf('    function createStore('), client.indexOf('    function SwitcherSettings('));
function setup(raw = null) {
  const storage = new Map(raw ? [['dsh.quick-switcher.preferences.v1', raw]] : []);
  const listeners = new Map();
  let fail = false;
  const window = { localStorage: { getItem: key => storage.get(key), setItem(key,value) { if (fail) throw Error('disk'); storage.set(key,value); } },
    addEventListener: (key, fn) => listeners.set(key, fn), removeEventListener: key => listeners.delete(key) };
  const context = vm.createContext({ window });
  vm.runInContext(helpers + '\nglobalThis.create = createPreferences;', context);
  return { preferences: context.create(), storage, failWrite: () => { fail = true; }, listeners, create: context.create };
}
test('four defaults; persisted settings restored; no extra data saved', () => {
  const app = setup(); const p = app.preferences;
  assert.equal(p.store.getSnapshot().recentLimit, 12);
  assert.equal(p.store.getSnapshot().providerLayout, 'auto');
  assert.equal(p.store.getSnapshot().focusComposer, true);
  assert.equal(p.store.getSnapshot().animations, true);
  p.update('recentLimit', 25); p.update('providerLayout', 'hidden'); p.update('focusComposer', false); p.update('animations', false);
  const restored = app.create().store.getSnapshot();
  assert.equal(restored.recentLimit, 25); assert.equal(restored.providerLayout, 'hidden');
  assert.equal(restored.focusComposer, false); assert.equal(restored.animations, false);
  const doc = JSON.parse(app.storage.get('dsh.quick-switcher.preferences.v1'));
  assert.deepEqual(Object.keys(doc.values).sort(), ['animations','focusComposer','providerLayout','recentDays','recentLimit','workspaceFocusComposer']);
});
test('workspace focus defaults on and persists independently from model focus', () => {
  const app = setup(JSON.stringify({version:1, values:{focusComposer:false}}));
  assert.equal(app.preferences.store.getSnapshot().workspaceFocusComposer, true);
  assert.equal(app.preferences.update('workspaceFocusComposer', false), true);
  const restored = app.create().store.getSnapshot();
  assert.equal(restored.workspaceFocusComposer, false);
  assert.equal(restored.focusComposer, false);
  assert.equal(app.preferences.update('workspaceFocusComposer', 'true'), false);
});

test('future or malformed storage is not overwritten', () => {
  for (const raw of ['{bad', '{"version":2,"values":{}}']) {
    const app = setup(raw); assert.equal(app.preferences.store.getSnapshot().writable, false);
    assert.equal(app.preferences.update('recentLimit', 20), false);
    assert.equal(app.storage.get('dsh.quick-switcher.preferences.v1'), raw);
  }
});
test('save failure retains accepted settings and surfaces an error', () => {
  const app = setup(); app.failWrite();
  assert.equal(app.preferences.update('animations', false), false);
  assert.equal(app.preferences.store.getSnapshot().animations, true);
  assert.equal(app.preferences.store.getSnapshot().error, 'settings.saveError');
});
test('other-window update synchronizes and listeners are disposed', () => {
  const app = setup(); app.listeners.get('storage')({ key: 'dsh.quick-switcher.preferences.v1', newValue: JSON.stringify({ version:1, values:{ recentLimit:7, animations:false } }) });
  assert.equal(app.preferences.store.getSnapshot().recentLimit, 7);
  assert.equal(app.preferences.store.getSnapshot().animations, false);
  app.preferences.dispose(); assert.equal(app.listeners.size, 0);
});

test('default seven days and legacy animations migrate to all three groups', () => {
  const app = setup(JSON.stringify({version:1, values:{animations:false}}));
  const value = app.preferences.store.getSnapshot();
  assert.equal(value.recentDays,7);
  assert.equal(value.animations,false);
  app.preferences.update('recentDays',0);
  assert.equal(app.create().store.getSnapshot().recentDays,0);
});

test('split animation preferences migrate once and unified choice takes precedence', () => {
  const app = setup(JSON.stringify({version:1,values:{workspaceAnimations:true,modelAnimations:false,recentAnimations:true}}));
  assert.equal(app.preferences.store.getSnapshot().animations,false);
  app.preferences.update('animations',true);
  assert.equal(app.create().store.getSnapshot().animations,true);
  const saved = JSON.parse(app.storage.get('dsh.quick-switcher.preferences.v1')).values;
  assert.equal(Object.hasOwn(saved,'modelAnimations'),false);
});
