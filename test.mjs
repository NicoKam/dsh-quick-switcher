import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('./client.js', import.meta.url), 'utf8');
function store(value) {
  const listeners = new Set();
  return { getSnapshot: () => value, subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }, set(next) { value = next; for (const fn of listeners) fn(); } };
}
let module;
const registrations = [], commands = [], edits = [], opened = [], selections = [], cleanups = [];
const storage = new Map();
const focusedSessions = [];
const React = { createElement: (...args) => ({ args }), useState: v => [v, () => {}], useRef: v => ({ current: v }), useEffect() {}, useMemo: fn => fn() };
const window = { __ModuleLoader__: { load(def) { module = def.factory(name => { assert.equal(name, 'react'); return React; }); } }, localStorage: { getItem: k => storage.get(k), setItem: (k,v) => storage.set(k,v), removeItem: k => storage.delete(k) } };
vm.runInNewContext(source, { window, document: { createElement: () => ({ dataset: {}, remove() {} }), head: { appendChild() {} } }, console });
const config = store({ status: 'ready', revision: 1 });
const catalog = store([{ id: 'session.workspacePick', modified: false }, { id: 'page.refresh', modified: false }]);
const sessions = store({ phase: 'ready', byId: { s1: { id: 's1', blank: true, retainedBy: { mainView: 1 } } } });
const panel = store({ activePanelId: null });
const directory = { async load() {}, store: store({ groups: [{ id: 'provider', name: 'Provider', models: [{ id: 'model', name: 'Model' }] }], current: { provider: 'provider', model: 'model' }, failures: [] }), async select(s) { selections.push(s); return { ok: true }; } };
const ctx = {
  effect(fn) { const cleanup = fn(); if (typeof cleanup === 'function') cleanups.push(cleanup); return cleanup; },
  locale: { register: () => () => {}, bind: () => k => k },
  slots: { inject: (_, fn) => fn(), register(opts, component) { registrations.push({ opts, component }); return () => {}; } },
  shortcuts: { runtime: 'desktop', config, catalog, register(command) {
    // Verify every declared Web profile, not only the currently active platform.
    for (const [profile, binding] of Object.entries(command.defaults)) {
      if (profile === 'web:linux') assert.ok(['Slash', 'Comma', 'Period'].includes(binding.code));
      if (profile.startsWith('web:')) assert.equal(binding.modifiers.length, 2);
    }
    commands.push(command); return () => {};
  }, describeBinding: () => ({ issue: null, conflicts: ['page.refresh'] }), async edit(edit, revision) {
    assert.equal(revision, config.getSnapshot().revision);
    edits.push(edit); config.set({ status: 'ready', revision: revision + 1 });
    return { status: 'saved', snapshot: config.getSnapshot() };
  } },
  layout: { panelInfo: panel }, sessions: { list: sessions, subagentAddress: () => undefined },
  workspaces: { list: store({ phase: 'ready', items: [{ workspaceId: 'w1', title: 'Workspace', path: '/workspace', sessionIds: ['s1'] }] }) },
  uiWorkspace: { async openWorkspace(id) { opened.push(id); } },
  get: name => name === 'modelDirectories' ? { directoryFor(id) { assert.equal(id, 's1'); return directory; } }
    : name === 'conversation' ? { input: { shell: id => ({ focus: () => focusedSessions.push(id) }) } } : undefined,
};
window.addEventListener = () => {};
window.removeEventListener = () => {};
module.apply(ctx);
await new Promise(resolve => setImmediate(resolve));
assert.equal(commands.length, 2);
assert.equal(edits.length, 2);
assert.equal(edits[0].id, 'page.refresh'); assert.equal(edits[0].binding, null);
assert.equal(edits[1].binding.code, 'KeyR');
const ws = commands.find(c => c.id === 'session.workspacePick');
const model = commands.find(c => c.id === 'session.modelPick');
assert.equal(model.defaults['desktop:macos'].code, 'KeyM');
assert.equal(model.defaults['desktop:macos'].modifiers.length, 1);
const overlay = registrations.find(item => item.opts.id === 'quick-switcher.overlay');
const injected = overlay.opts.inject();
const picker = injected.hooks.picker;
ws.resolve().run(); assert.equal(picker.getSnapshot().kind, 'workspace');
injected.choose('ws:w1'); await new Promise(resolve => setImmediate(resolve));
assert.deepEqual(opened, ['w1']);
// A successful workspace navigation focuses only when its independent setting is on.
const settings = registrations.find(item => item.opts.id === 'quick-switcher').opts.inject();
const baseOpenWorkspace = ctx.uiWorkspace.openWorkspace;
ctx.uiWorkspace.openWorkspace = async (id, beforeOpen) => { beforeOpen('s1'); };
settings.updatePreference('focusComposer', false);
ws.resolve().run(); injected.choose('ws:w1'); await new Promise(resolve => setImmediate(resolve));
assert.deepEqual(focusedSessions, ['s1']);
settings.updatePreference('workspaceFocusComposer', false);
ws.resolve().run(); injected.choose('ws:w1'); await new Promise(resolve => setImmediate(resolve));
assert.deepEqual(focusedSessions, ['s1']);
ctx.uiWorkspace.openWorkspace = async () => {}; // superseded navigation has no selected id
settings.updatePreference('workspaceFocusComposer', true);
ws.resolve().run(); injected.choose('ws:w1'); await new Promise(resolve => setImmediate(resolve));
assert.deepEqual(focusedSessions, ['s1']);
ctx.uiWorkspace.openWorkspace = baseOpenWorkspace;
focusedSessions.length = 0;
settings.updatePreference('focusComposer', true);
model.resolve().run(); await new Promise(resolve => setImmediate(resolve));
assert.equal(picker.getSnapshot().rows.length, 1);
assert.equal(picker.getSnapshot().rows[0].current, true);
injected.choose('model:provider/model'); await new Promise(resolve => setImmediate(resolve));
assert.equal(selections[0].provider, 'provider'); assert.equal(picker.getSnapshot().open, false);
assert.equal(picker.getSnapshot().focusSessionId, 's1');
injected.focusComposer('s1'); assert.deepEqual(focusedSessions, ['s1']);
injected.focusComposer('other'); assert.deepEqual(focusedSessions, ['s1']);
sessions.set({ phase: 'ready', byId: { s1: { id: 's1', blank: false, retainedBy: { mainView: 1 } } } });
assert.equal(ws.resolve().status, 'blocked'); assert.equal(model.resolve().status, 'handled');
panel.set({ activePanelId: 'settings' }); assert.equal(model.resolve().status, 'blocked');
for (const dispose of cleanups.reverse()) dispose();
console.log('PASS: registrations, desktop bindings, session ids, actions and scope restrictions');

// Render with a tiny deterministic hook runner to exercise real key handlers.
const values = [], pendingEffects = [], dependencies = [], disposers = [];
let cursor = 0;
const keyListeners = new Set();
window.addEventListener = (type, fn) => { if (type === 'keydown') keyListeners.add(fn); };
window.removeEventListener = (type, fn) => keyListeners.delete(fn);
React.useState = initial => { const at = cursor++; if (!(at in values)) values[at] = initial; return [values[at], next => { values[at] = typeof next === 'function' ? next(values[at]) : next; }]; };
React.useRef = initial => { const at = cursor++; return values[at] ?? (values[at] = { current: initial }); };
React.useMemo = fn => fn();
React.useEffect = (fn, deps) => {
  const at = cursor++;
  if (!dependencies[at] || deps.some((v,i) => !Object.is(v, dependencies[at][i]))) {
    dependencies[at] = deps;
    pendingEffects.push(() => { disposers[at]?.(); disposers[at] = fn(); });
  }
};
let view = { open: true, kind: 'model', status: 'ready', error: null, rows: [
  { key: 'a:1', kind: 'model', provider: 'a', providerName: 'Alpha', title: 'A1', current: true },
  { key: 'a:2', kind: 'model', provider: 'a', providerName: 'Alpha', title: 'A2' },
  { key: 'b:1', kind: 'model', provider: 'b', providerName: 'Beta', title: 'B1' },
] };
const picked = [];
const componentProps = { usePicker: fn => fn(view), choose: key => picked.push(key), cancel() {}, t: key => key };
function renderPicker() {
  let tree;
  for (let i=0; i<3; i++) { cursor = 0; tree = overlay.component(componentProps); for (const run of pendingEffects.splice(0)) run(); }
  return tree;
}
function nodes(tree, predicate, result = []) {
  if (Array.isArray(tree)) for (const child of tree) nodes(child, predicate, result);
  else if (tree?.args) { if (predicate(tree.args)) result.push(tree); for (const child of tree.args.slice(2)) nodes(child, predicate, result); }
  return result;
}
function keypress(key) {
  let consumed = false;
  for (const fn of [...keyListeners]) fn({ key, preventDefault() { consumed = true; }, stopPropagation() {} });
  assert.ok(consumed, key + ' is owned by picker');
  return renderPicker();
}
// First open must locate a current model which is not the first row.
view = { ...view, rows: view.rows.map(row => ({ ...row, current: row.key === 'b:1' })) };
let tree = renderPicker();
assert.equal(nodes(tree, args => args[0] === 'input')[0].args[1]['aria-activedescendant'], 'dqs-model-2');
// Reopen from a stale filter and position: locate current model again, never keep the old index.
view = { ...view, open: false }; renderPicker();
view = { ...view, open: true, status: 'loading', rows: [] }; renderPicker();
view = { ...view, status: 'ready', rows: [
  { key: 'a:1', kind: 'model', provider: 'a', title: 'A1', current: true },
  { key: 'a:2', kind: 'model', provider: 'a', title: 'A2' },
  { key: 'b:1', kind: 'model', provider: 'b', title: 'B1' },
] };
tree = renderPicker();
assert.equal(nodes(tree, args => args[0] === 'input')[0].args[1]['aria-activedescendant'], 'dqs-model-0');
assert.equal(nodes(tree, args => args[1]?.className === 'dqs-provider').length, 3);
keypress('ArrowLeft'); tree = keypress('ArrowDown');
assert.equal(nodes(tree, args => args[1]?.className === 'dqs-row').length, 2);
// Simulate the filtered current-model row appearing underneath a stationary mouse.
nodes(tree, args => args[1]?.className === 'dqs-row')[0].args[1].onMouseEnter();
tree = renderPicker();
assert.equal(nodes(tree, args => args[0] === 'input')[0].args[1]['aria-controls'], 'dqs-providers');
tree = keypress('ArrowDown');
assert.equal(nodes(tree, args => args[1]?.className === 'dqs-row').length, 1);
tree = keypress('ArrowUp');
assert.equal(nodes(tree, args => args[0] === 'input')[0].args[1]['aria-controls'], 'dqs-providers');
keypress('Enter'); keypress('ArrowDown'); keypress('Enter'); assert.equal(picked.at(-1), 'a:2');
keypress('ArrowLeft'); tree = keypress('ArrowDown');
assert.equal(nodes(tree, args => args[1]?.className === 'dqs-row').length, 1);
keypress('ArrowRight'); keypress('Enter'); assert.equal(picked.at(-1), 'b:1');
view = { ...view, rows: view.rows.filter(row => row.provider === 'b') };
tree = renderPicker(); assert.equal(nodes(tree, args => args[1]?.className === 'dqs-providers').length, 0);
let preferenceView = { recentLimit:12, providerLayout:'hidden', focusComposer:true, animations:false };
componentProps.usePreferences = fn => fn(preferenceView);
view = { ...view, rows: [
  { key:'a:1',kind:'model',provider:'a',title:'A1' },
  { key:'b:1',kind:'model',provider:'b',title:'B1' },
] };
tree = renderPicker();
assert.equal(nodes(tree, args => args[1]?.className === 'dqs-providers').length, 0);
assert.equal(nodes(tree, args => args[1]?.className === 'dqs-row').length, 2);
assert.equal(nodes(tree, args => args[1]?.className === 'dqs-card')[0].args[1]['data-animations'], false);
preferenceView = { ...preferenceView, providerLayout:'always' };
view = { ...view, rows:view.rows.slice(0,1) };
tree = renderPicker();
assert.equal(nodes(tree, args => args[1]?.className === 'dqs-providers').length, 1);
for (const dispose of disposers) if (typeof dispose === 'function') dispose();
assert.equal(keyListeners.size, 0);
console.log('PASS: all providers, left/up/down filtering, Enter/right handoff, model selection, single-provider layout and key listener disposal');
